// === SkyGemini — стабильная версия с сезонными свечами ===
// Работает с листом "УЧЕТ" и листом "СТАТИСТИКА"
// Часовой пояс: GMT+5 (Алматы)

const SHEET_NAME = 'УЧЕТ';
const STATS_SHEET = 'СТАТИСТИКА';
const TIMEZONE = 'GMT+5';

// === 🔹 Утилиты ===
function parseDateCell(v) {
  if (!v && v !== 0) return null;
  if (v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  const s = String(v).trim();
  const m = s.match(/^(\d{2})[.\-\/](\d{2})[.\-\/](\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m2) return new Date(Number(m2[1]), Number(m2[2]) - 1, Number(m2[3]));
  return null;
}
function toNumber(v) {
  if (v === null || v === undefined || v === '') return 0;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s.replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}
function fmtDate(d) {
  return Utilities.formatDate(d, TIMEZONE, 'dd.MM.yyyy');
}
function _log(msg) { Logger.log(msg); }

// === 🕯️ Универсальный onEdit (исправленный, без дубликатов) ===
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    if (!sheet || sheet.getName() !== SHEET_NAME) return;
    const row = e.range.getRow();
    const col = e.range.getColumn();
    if (row < 2) return;

    // === 🕯️ Обычные свечи ===
    if (col >= 3 && col <= 4) {
      const yesterday = toNumber(sheet.getRange(row, 2).getValue()); // B
      const today = toNumber(sheet.getRange(row, 3).getValue());     // C
      const spent = toNumber(sheet.getRange(row, 4).getValue());     // D

      const earned = (today - yesterday) + spent; // с учётом трат
      const gross = today - yesterday;            // без учёта трат

      sheet.getRange(row, 5).setValue(earned);
      sheet.getRange(row, 6).setValue(gross);
    }

    // === 🌟 Сезонные свечи ===
    if (col === 7 || col === 8) {
      const totalSeason = toNumber(sheet.getRange(row, 7).getValue());
      const spentSeason = toNumber(sheet.getRange(row, 8).getValue());
      let prevSeason = 0;
      if (row > 2) prevSeason = toNumber(sheet.getRange(row - 1, 7).getValue());
      const earnedSeason = (totalSeason - prevSeason) + spentSeason;
      sheet.getRange(row, 9).setValue(earnedSeason);
    }

    updateStatsSafe();
  } catch (err) {
    Logger.log('onEdit error: ' + err);
  }
}

// === 🔄 Безопасное обновление статистики ===
function updateStatsSafe() {
  try {
    updateStats();
  } catch (err) {
    Logger.log('updateStatsSafe: ' + err);
  }
}

// === 🕓 Определение игрового дня ===
function getGameDateNow() {
  const now = new Date();
  const localStr = Utilities.formatDate(now, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
  const local = new Date(localStr);
  const hour = local.getHours();
  const gd = new Date(local.getFullYear(), local.getMonth(), local.getDate());
  if (hour < 13) gd.setDate(gd.getDate() - 1);
  return gd;
}

// === 🗓 Автоматическое добавление нового дня ===
function addDailyRowIfNeeded() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');

  const lastRow = sheet.getLastRow();
  const gameDate = getGameDateNow();
  const gameDateStr = fmtDate(gameDate);

  if (lastRow < 2) {
    sheet.appendRow(['Дата','Вчера','Сегодня','Потрачено','Получено','Вообщем','Сезонные🧨','Потрачено🧨','Получено🧨','Примечание']);
    sheet.appendRow([gameDate, 0, '', '', '', '', '', '', '', '']);
    return;
  }

  const lastDate = parseDateCell(sheet.getRange(lastRow, 1).getValue());
  const lastDateStr = lastDate ? fmtDate(lastDate) : '';
  if (gameDateStr === lastDateStr) return;

  const prevToday = toNumber(sheet.getRange(lastRow, 3).getValue());
  const newRow = lastRow + 1;
  sheet.getRange(newRow, 1).setValue(gameDate);
  sheet.getRange(newRow, 2).setValue(prevToday);
  sheet.getRange(newRow, 3, 1, 7).setValues([['','','','','','','']]);
  Logger.log('New day added: ' + gameDateStr);
  updateStatsSafe();
}

// === ⏰ Создание триггера (каждый день в 12:00) ===
function createDailyTrigger() {
  const existing = ScriptApp.getProjectTriggers();
  for (let t of existing) {
    if (t.getHandlerFunction() === 'addDailyRowIfNeeded') ScriptApp.deleteTrigger(t);
  }
  ScriptApp.newTrigger('addDailyRowIfNeeded').timeBased().everyDays(1).atHour(13).create();
  Logger.log('Daily trigger created');
}

// === ♻️ Пересчёт всей таблицы вручную ===
function recalcAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return;
  const last = sheet.getLastRow();
  if (last < 2) return;

  for (let r = 2; r <= last; r++) {
    const yesterday = toNumber(sheet.getRange(r, 2).getValue());
    const today = toNumber(sheet.getRange(r, 3).getValue());
    const spent = toNumber(sheet.getRange(r, 4).getValue());
    const earned = (today - yesterday) + spent;
    const gross = today - yesterday;
    sheet.getRange(r, 5).setValue(earned);
    sheet.getRange(r, 6).setValue(gross);

    const totalSeason = toNumber(sheet.getRange(r, 7).getValue());
    const spentSeason = toNumber(sheet.getRange(r, 8).getValue());
    let prevSeason = 0;
    if (r > 2) prevSeason = toNumber(sheet.getRange(r - 1, 7).getValue());
    const earnedSeason = (totalSeason - prevSeason) + spentSeason;
    sheet.getRange(r, 9).setValue(earnedSeason);
  }
  updateStatsSafe();
}

// === 📊 Статистика ===
function updateStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const stat = ss.getSheetByName(STATS_SHEET) || ss.insertSheet(STATS_SHEET);
  const last = sheet.getLastRow();
  if (last < 2) return stat.clearContents();

  const data = sheet.getRange(2,1,last-1,9).getValues();
  const now = new Date();
  let weekEarned = 0, weekDays = 0, monthEarned = 0, monthDays = 0;
  let totalEarned = 0, totalSpent = 0, currentBalance = 0;
  let seasonEarned = 0, seasonSpent = 0;

  for (let i = 0; i < data.length; i++) {
    const [date, , , spent, earned, , seasonTotal, seasonSpentCol, seasonEarnedCol] = data[i];
    const d = parseDateCell(date);
    totalEarned += toNumber(earned);
    totalSpent += toNumber(spent);
    seasonEarned += toNumber(seasonEarnedCol);
    seasonSpent += toNumber(seasonSpentCol);
    currentBalance = toNumber(data[i][2]);

    if (d instanceof Date) {
      const diffDays = Math.floor((now - d) / (1000*3600*24));
      if (diffDays <= 6) { weekEarned += toNumber(earned); weekDays++; }
      if (d >= new Date(now.getFullYear(), now.getMonth(), 1)) { monthEarned += toNumber(earned); monthDays++; }
    }
  }

  const avgWeek = weekDays ? (weekEarned / weekDays).toFixed(1) : 0;
  const avgMonth = monthDays ? (monthEarned / monthDays).toFixed(1) : 0;

  const rows = [
    ['📊 Статистика фарма',''],
    ['За последние 7 дней', weekEarned],
    ['Средний фарм в день (7д)', avgWeek],
    ['За месяц', monthEarned],
    ['Средний фарм в день (мес)', avgMonth],
    ['Всего собрано (обычные)', totalEarned],
    ['Всего потрачено (обычные)', totalSpent],
    ['Всего сезонных собрано', seasonEarned],
    ['Всего сезонных потрачено', seasonSpent],
    ['Текущий баланс', currentBalance],
    ['Обновлено', Utilities.formatDate(new Date(), TIMEZONE, 'dd.MM.yyyy HH:mm')]
  ];

  stat.clearContents();
  stat.getRange(1,1,rows.length,2).setValues(rows);
}
