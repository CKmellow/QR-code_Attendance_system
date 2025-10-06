🧾 Project Title: QR Code Attendance System
📘 Overview

The QR Code Attendance System is a web-based platform designed to simplify attendance tracking in universities and colleges. It allows lecturers to generate unique QR codes for each class session and enables students to mark attendance by scanning the code via their mobile devices. The system securely logs attendance data in real-time, reducing manual errors and preventing proxy attendance.

🚀 Key Features

Role-Based Access: Separate dashboards for Lecturers and Students.

QR Code Generation: Lecturers can create time-sensitive QR codes for each class.

Instant Attendance Logging: Students scan QR codes to record attendance instantly.

Session Management: Tracks class sessions by course, date, and time.

Secure Verification: Prevents duplicate and late submissions using token expiration.

Database Integration: All attendance records stored securely in a central database.

Analytics & Reports: Lecturers can view and export attendance summaries.

🛠️ Tech Stack

Frontend: React.js (Vite) + Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB Atlas

Authentication: JWT-based login for Lecturers and Students

QR Codes: Generated using qrcode or qrcode-generator library

Hosting: Vercel / Render / Railway (configurable)

⚙️ How It Works

Lecturer logs in and creates a new class session.

The system generates a unique QR code valid for a limited time.

Students log in and scan the QR code to mark attendance.

Attendance data is stored in MongoDB for verification and reports.

💡 Future Enhancements

Integration with student management systems (e.g., Strathmore SIS).

Facial recognition for dual verification.

Mobile app support for offline attendance.

Admin panel for course and lecturer management.
