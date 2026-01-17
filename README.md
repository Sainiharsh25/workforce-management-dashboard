# 📊 Real-Time Company Management & Workforce Tracking System

An enterprise-grade MERN stack application integrated with a Python-based tracking client to monitor employee activity in real time. The system includes workforce status monitoring, KPI analytics, live dashboards, location-based attendance, and employee performance visualization.

---

## 🚀 Features

### 🌐 Dashboard (React + Node.js)
- Employee List with status (Active/Inactive)
- Task Progress & Monthly Reports
- KPI-based Performance Analytics
- Top/Low Performer Charts
- Real-time Attendance and Work Hours Tracking
- Live Updates via WebSocket
- Export data to CSV/Excel
- Dark/Light Mode Support

### 🖥️ Python WorkForce App
- Tracks mouse and keyboard activity
- Logs login/logout, active/inactive sessions
- Detects work-from-home or office via Wi-Fi IP
- Sends real-time updates to dashboard via WebSocket

---

## 🧑‍💻 Tech Stack

| Layer         | Technology               |
|---------------|--------------------------|
| Frontend      | React.js, Tailwind CSS   |
| Backend       | Node.js, Express.js      |
| Database      | MongoDB (Mongoose ORM)   |
| Real-time     | WebSocket (Socket.IO)    |
| Tracking App  | Python (psutil, pynput)  |

---

## 🏗️ Architecture Overview

```
[ Python WorkForce App ]
        |
     WebSocket
        ↓
[ WebSocket Server (Node.js) ]
        |
   MongoDB (Activity Logs)
        |
[ React Dashboard (Live Charts, KPIs, Tables) ]
```

---

## ⚙️ Setup Instructions

### 📁 Clone the Repository

```bash
git clone https://github.com/yourusername/workforce-dashboard.git
cd workforce-dashboard
```

---

### 🖥️ Backend Setup (Node.js + Express)

1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/workforce
   PORT=5000
   ```

4. Start backend server:
   ```bash
   npm run dev
   ```

---

### 💻 Frontend Setup (React)

1. Navigate to `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update WebSocket endpoint in `.env`:
   ```env
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. Start the React app:
   ```bash
   npm start
   ```

---

### 🐍 Python WorkForce Tracking App

1. Navigate to `python-tracker` folder:
   ```bash
   cd ../python-tracker
   ```

2. Create a virtual environment (optional):
   ```bash
   python -m venv venv
   source venv/bin/activate  # for Linux/macOS
   venv\Scripts\activate     # for Windows
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the tracking app:
   ```bash
   python app.py
   ```

---

## 📦 Folder Structure

```plaintext
📁 backend              # Express backend
📁 frontend             # React Dashboard
📁 python-tracker       # Python tracking app
📄 README.md
```

---

## 📊 Sample Dashboard Preview

![Dashboard Screenshot](./preview/dashboard.png)

---

## 📋 To-Do / Improvements

- [ ] Add JWT-based authentication
- [ ] Deploy with Docker
- [ ] Add Admin/HR role controls
- [ ] Push notification integration (Slack/Email)
- [ ] Mobile app version

---

## 📃 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📧 Contact

Made by HARSH SAINI(https://github.com/Sainiharsh25)  
Email: harshsaini00025@gmai.com 
Project: Real-Time Workforce Tracking System
