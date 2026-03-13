# 🌙 Ramadan Task Management System

A Full-Stack task management application designed for the Ramadan season, featuring AI-generated task categorization and real-time completion tracking.

---

## 👤 Submitted By
**Name:** Jwan Alghamdi 
**Project Role:** Full-Stack Developer (Bootcamp Student)

---

## 🏆 Completed Challenges

I have successfully implemented the following challenges as per the bootcamp requirements:

### ✅ Challenge 2: AI-Powered Tagging System (30 pts)
- **Feature:** Added a dynamic "Tag" badge to each task card.
- **AI Integration:** Modified the backend logic to prompt **Google Gemini AI** to automatically categorize tasks into categories like `Personal`, `Community`, `Urgent`, or `Religious`.
- **UI:** Designed a responsive tag badge in React that displays the AI-generated category.

### ✅ Challenge 3: Dedicated Completion Route (10 pts)
- **Feature:** Implemented a robust `/complete` route in the Flask backend.
- **Logic:** Refined the `crud.py` operations to handle task state updates correctly, ensuring that completed tasks are saved and persist in the database.

### ✅ Bonus: Organized Repository & Documentation (10 pts)
- **Feature:** Structured the project into a professional monorepo containing both `frontend` and `backend` directories.
- **Git Flow:** Documented the project progress using Git for version control.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS.
- **Backend:** Python, Flask, Google GenAI (Gemini 3 Flash).
- **Storage:** JSON-based local database for tasks.

---

## 📂 Project Structure

```text
/
├── frontend/    # React + TypeScript application
├── backend/     # Flask API + AI Logic
└── README.md    # Project documentation
