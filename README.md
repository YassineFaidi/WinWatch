# WinWatch

**WinWatch** is a comprehensive log analytics pipeline and visualization dashboard. It collects Windows logs via **Nxlog**, forwards them through **Vector** on an Ubuntu server, stores them in **ClickHouse**, and finally provides an interactive **web dashboard** for querying and visualizing logs.

![WinWatch Dashboard](/frontend/public/screenshots/dashboard.png)

---

## 🚀 Features

- **Windows Log Collection**: Capture detailed Windows event logs with Nxlog
- **TCP Forwarding**: Reliable log forwarding from Windows machines to the Ubuntu server
- **Vector Ingestion**: Efficient log processing and streaming with Vector
- **ClickHouse Storage**: High-performance columnar database for log queries
- **REST APIs**: Node.js + Express backend to serve log data
- **Interactive Dashboard**: React + Tailwind frontend for visualization
- **Real-Time Insights**: Query and filter logs instantly
- **Scalable Pipeline**: Designed for extensibility and performance

---

## 🛠️ Tech Stack

### Log Pipeline
- **Nxlog**: Windows log collector and forwarder
- **Vector**: Log ingestion and transport on Ubuntu
- **ClickHouse**: High-performance analytics database

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: REST API framework
- **ClickHouse Client**: Database driver for queries

### Frontend
- **React 18**: Component-based UI library
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Interactive data visualizations
- **Vite**: Fast build tool and dev server

---

## 📋 Prerequisites

Before setting up WinWatch, make sure you have:

- **Node.js** (v16 or higher)  
- **npm** (comes with Node.js)  
- **ClickHouse** installed and running on Ubuntu  
- **Vector** configured on the server  
- **Nxlog** installed on Windows  

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YassineFaidi/WinWatch.git
cd WinWatch
````

### 2. Configure ClickHouse

Import the provided SQL file to create the database and tables:

```bash
clickhouse-client --multiquery < configs/clickhouse/schema.sql
```

* `schema.sql` contains all necessary SQL commands to create the database and logs table.
* Make sure ClickHouse is running and accessible.

### 3. Configure the Pipeline

* Place the **Nxlog config** in your Windows machine under `C:\Program Files\nxlog\conf\nxlog.conf`
* Place the **Vector config** in your Ubuntu server under `/etc/vector/vector.yaml`

### 4. Install Dependencies

**Backend**

```bash
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

### 5. Start the Application

**Terminal 1 - Start Backend**

```bash
node server.js
```

Runs on `http://localhost:3001`

**Terminal 2 - Start Frontend**

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:3000`

### 6. Access the Dashboard

Open your browser and navigate to:
👉 `http://localhost:3000`

---

## 📖 Usage

1. Logs are generated on **Windows** and sent via **Nxlog** → **Vector** → **ClickHouse**
2. The **backend** exposes APIs for querying log data
3. The **frontend dashboard** lets you:

   * View incoming logs in real-time
   * Filter and query logs
   * Visualize metrics with charts

---

## 🏗️ Project Structure

```
WinWatch/
├── configs/                 
│   ├── clickhouse/          # ClickHouse configs & schema.sql
│   ├── nxlog/               # Nxlog configs (Windows)
│   ├── vector/              # Vector configs (Ubuntu)
│
├── backend/                 # Node.js + Express backend 
│   ├── config/              # DB connection & env vars
│   ├── models/              # Log models
│   ├── routes/              # API routes
│   ├── services/            # Log query logic
│   └── utils/               # Helpers
│
├── frontend/                # React + Tailwind frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Dashboard pages
│   │   ├── services/        # API integration
│   │   └── charts/          # Data visualizations
│
└── server.js                # Backend entry point
```

---

## 🔧 Configuration

* **Frontend Port**: `3000` (Vite default)
* **Backend Port**: `3001`
* **Database**: ClickHouse (`localhost:8123`) — tables created from `configs/clickhouse/schema.sql`
* **Vector Listener**: TCP (`0.0.0.0:6000`)
* **Nxlog**: Configured to forward Windows logs to the server TCP port

---

## 🤝 Contributing

1. **Fork the repo**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -m "Add feature"`
4. **Push**: `git push origin feature/your-feature`
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

* **Nxlog** for Windows log forwarding
* **Vector** for scalable log ingestion
* **ClickHouse** for powerful log queries
* **React + Tailwind** for modern UI
* **Express.js** for backend services

---

## 📞 Support

* Open an [issue](https://github.com/YassineFaidi/WinWatch/issues)
* Provide environment details and steps to reproduce

---

## 🔄 Version History

* **v1.0.0** - Initial release with full pipeline integration

  * Nxlog → Vector → ClickHouse → Dashboard

---
