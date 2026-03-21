# Movivo

Welcome to the **Movivo** project! This application consists of a React frontend, a Node.js Express backend, and uses InfluxDB for time-series data storage.

---

## 🚀 Quick Start (Docker - Recommended)

The easiest way to run the entire stack (Frontend, Backend, and Database) is using Docker Compose.

### 1. Build & Start

First, build the frontend image, then bring up the entire environment:

```bash
docker compose build frontend
docker compose up
```

or 
```bash
docker compose up --build 
```


*(You can add the `-d` flag to `docker compose up` to run it in the background).*

### 2. Access the Application
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **InfluxDB UI:** [http://localhost:8086](http://localhost:8086)

### 3. Stopping Docker
To stop the services and clean up containers, simply run:
```bash
docker compose down
```

*(Note: Adding `-v` to the down command will permanently wipe your InfluxDB database data).*

---

## 💻 Local Development

If you prefer to run the services locally on your machine (without Docker), follow these steps in separate terminal windows:

### Frontend
```bash
cd frontend
npm install
npm run dev
```
run docker compose build frontend to reload the frontend

### Backend
Make sure you have an InfluxDB instance running elsewhere and configured via your local environment variables before starting the backend.
```bash
cd backend
npm install
npm run dev  # or npm start
```
