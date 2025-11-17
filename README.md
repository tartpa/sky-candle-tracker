# sky-candle-tracker
utomatic Sky: Children of the Light candle tracking Google Sheet + Apps Scrip

# Sky Candle Tracker — Automatic Google Sheets Tracker  
Track candles, seasonal candles, spending, earnings, and daily reset logic for **Sky: Children of the Light**.

This project provides a **ready-to-use Google Sheet + Apps Script** that automatically:
- Creates a new row every day at the game's reset time
- Calculates earned candles (with and without spending)
- Tracks seasonal candles the same way
- Builds statistics: last 7 days, monthly average, totals
- Supports manual edits safely without breaking the sheet
- Works in GMT+5 (Almaty) — adjustable

---

## ⭐ Features

### 🔥 Daily Automation
- Auto-create new day at **13:00** (winter reset)
- Auto-fill yesterday’s total → keeps continuity

### 🕯 Candle Tracking
- Earned with spending  
- Earned without spending  
- Detects negative or unusual values safely

### 🧨 Seasonal Candle Tracking
- Same logic as normal candles  
- Earned with/without spending  
- Fully integrated in statistics

### 📊 Statistics Page
Automatically updates:
- Last 7 days total
- Average per day (7 days & monthly)
- Total earned candles
- Total spent candles
- Seasonal totals
- Current balance
- Last updated timestamp

---

## 📘 Installation Guide

### 1. Make a copy of the template Sheet  
Create your own sheet with the required columns:

```
Дата | Вчера | Сегодня | Потрачено | Получено | Вообщем | Сезонные🧨 | Потрачено🧨 | Получено🧨 | Примечание
```

(Or copy the sample sheet if provided)

---

### 2. Open Apps Script
Go to:  
**Extensions → Apps Script**

Delete any default code.

---

### 3. Paste the content of `/src/Code.gs`

Save the project.

---

### 4. Set Timezone  
In Apps Script:

`Project Settings → Script Timezone → GMT+5`

---

### 5. Create the daily trigger  
Go to:

**Triggers → Add Trigger**

- Function: `addDailyRowIfNeeded`
- Type: Time based
- Frequency: Daily
- Time: 13:00

This matches Sky’s daily reset (winter time).

---

## 🔧 Recalculate Manually

If something gets changed by hand:

`Run → recalcAll()`

---

## 🎯 Recommended Sheet Settings

- Conditional formatting for negative values
- Freeze first row
- Freeze first column
- Auto-sizing

---

## 🧩 Folder Structure

```
sky-candle-tracker/
│
├── README.md
├── LICENSE
│
├── docs/
│   ├── setup_guide.md
│   ├── troubleshooting.md
│   └── screenshots/
│
└── src/
    └── Code.gs
```

---

## 📄 License
MIT — free to use, modify, share.

---

Enjoy tracking your Sky candles automatically! ☁🕯✨
