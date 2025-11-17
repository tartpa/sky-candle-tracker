Sky Candle Tracker — Setup Guide (EN)

Automatic candle tracker for Sky: Children of the Light built with Google Sheets + Apps Script.

This tool was created as a personal project, for learning Google Sheets automation and for convenient daily tracking in Sky.
Anyone is welcome to improve, remix or extend it — feel free to build your own version if you have more experience or new ideas.

⸻

⭐ Features

🔥 Daily Automation
	•	Automatically creates a new row at Sky’s daily reset time
	•	Carries over yesterday’s balance
	•	Works even if you edit the sheet manually

🕯 Normal Candle Tracking
	•	Earned
	•	Spent
	•	Net income
	•	Built-in protection from negative or invalid values

🧨 Seasonal Candle Tracking
	•	Same logic as normal candles
	•	Earned/spent/net
	•	Fully included in statistics

📊 Statistics Page

Auto-generated metrics:
	•	Last 7 days total
	•	7-day average
	•	Monthly average
	•	Total earned
	•	Total spent
	•	Seasonal totals
	•	Current balance
	•	Last updated timestamp

⸻

📘 Installation Guide

1. Create Your Sheet

Create a sheet named УЧЕТ (you may rename later) with these columns:

Date | Yesterday | Today | Spent | Earned | Total | Seasonal🧨 | Seasonal Spent🧨 | Seasonal Earned🧨 | Notes

Create another sheet named СТАТИСТИКА (empty).

❗ Column names can be in English —
just make sure to update the names inside the script if you change them.

⸻

2. Open Google Apps Script

In your Google Sheet:
Extensions → Apps Script

Delete the default code.

⸻

3. Paste the script

Copy the content of /src/Code.gs into your project and save it.

⸻

4. Set the Time Zone

Google Apps Script:
Project Settings → Script Timezone

Set it to GMT+5 (Asia/Almaty) — this is the default Sky reset time used in the script.

🕒 Important:
If you live in a different region, you must adjust the trigger time so it matches your local Sky reset time.

For example:
	•	NA servers reset earlier/later
	•	EU has a different local reset depending on DST
	•	Some countries shift time seasonally (summer/winter resets)

⸻

⏰ 5. Create the Daily Trigger

Go to:
Triggers → Add Trigger

Set:
	•	Function: addDailyRowIfNeeded
	•	Event Type: Time-based
	•	Frequency: Daily
	•	Time: 13:00 (GMT+5) ← default Sky winter reset for Kazakhstan

If your region has a different reset time, set the time accordingly.

⸻

🔧 Manual Recalculation

If you change something manually:
	•	Run → recalcAll()
	•	Run → updateStats()

Google will ask for permission the first time.

⸻

🎯 Recommended Sheet Settings
	•	Freeze the first row
	•	Freeze the first column
	•	Auto-size columns
	•	Add conditional formatting:
	•	negative numbers → red
	•	empty values → gray

🧩 Folder Structure

sky-candle-tracker/
│																	
├── README.md
├── LICENSE
│
├── docs/
│   ├── setup_guideEN.md
│   ├── setup_guideRU.md
│   ├── troubleshooting.md
│   └── screenshots/
│
└── src/
    └── Code.gs


⸻

📄 License

MIT License — free to use, modify and share.

⸻

☁🕯✨ Enjoy your fully automated candle tracking!
