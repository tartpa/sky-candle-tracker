Sky Candle Tracker — Setup Guide (EN)

1. Create Your Google Sheet

Create two sheets:

Sheet УЧЕТ (or MAIN if you prefer English)

Add these columns in order:
	1.	Date
	2.	Yesterday
	3.	Today
	4.	Spent
	5.	Received
	6.	Total
	7.	Seasonal🧨
	8.	Seasonal Spent🧨
	9.	Seasonal Received🧨
	10.	Notes

(If you prefer English names, rename the sheet to MAIN and update column names inside the script accordingly.)

Sheet СТАТИСТИКА (or STATS)

Create an empty sheet.

⸻

2. Install the Script
	1.	Go to Extensions → Apps Script.
	2.	Delete all contents of Code.gs.
	3.	Paste the code from /src/Code.gs.
	4.	Save.

⸻

3. Set the Timezone

Open: Project Settings → Script Timezone → GMT+5.

This timezone matches Sky’s reset time for Kazakhstan.

⸻

4. Create a Daily Trigger
	1.	Open Triggers.
	2.	Add a new trigger:
	•	Function: addDailyRowIfNeeded
	•	Event type: Time-driven
	•	Frequency: Daily
	•	Time: 13:00.

⸻

5. First Run

Run manually:
	•	recalcAll()
	•	updateStats()

Grant permissions if requested.

⸻

6. Done! 🎉

Your sheet will now:
	•	Add daily rows automatically
	•	Recalculate candle totals
	•	Track seasonal candles
	•	Update the stats sheet

⸻

If you prefer English sheet names

Update sheet names inside the script:

'УЧЕТ' → 'MAIN'
'СТАТИСТИКА' → 'STATS'

Update column references accordingly, for example:

sheet.getRange("Сегодня") → sheet.getRange("Today")
