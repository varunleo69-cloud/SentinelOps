# SentinelOps — Self-Healing Deployment Platform

## 1. Project Overview

SentinelOps is a Docker-based Self-Healing Deployment Platform designed to demonstrate automated application monitoring, failure detection, and recovery.

The project uses Docker to containerize the application, Prometheus to collect application metrics, Grafana to visualize monitoring data, and a custom Python recovery monitor to detect application health failures and trigger recovery actions.

It also includes a web-based dashboard that provides system status, monitoring information, and controls to simulate application failures.

## 2. Project Objectives

- Containerize a Flask application using Docker.
- Manage multiple services using Docker Compose.
- Monitor application health and performance.
- Collect metrics using Prometheus.
- Visualize metrics using Grafana.
- Automatically recover from application process crashes.
- Implement a custom recovery monitor for application health failures.
- Automate application build and testing using GitHub Actions.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Python | Application and recovery monitor |
| Flask | Backend web application |
| HTML, CSS, JavaScript | Dashboard frontend |
| Docker | Application containerization |
| Docker Compose | Multi-container management |
| Prometheus | Metrics collection |
| Grafana | Metrics visualization |
| GitHub Actions | Continuous integration |

## 4. System Architecture

The SentinelOps platform consists of four main services:

1. **Flask Application:** Runs the web application and exposes health and metrics endpoints.
2. **Prometheus:** Collects application metrics from the Flask application.
3. **Grafana:** Visualizes the collected metrics through dashboards.
4. **Recovery Monitor:** Periodically checks application health and requests a container restart after three consecutive health-check failures.

Docker restart policies handle application process crashes.

### Architecture Flow

```text
             GitHub Actions
                   |
             Docker Build
                   |
              Docker Compose
                   |
       +-----------+-----------+
       |           |           |
    Flask       Prometheus   Grafana
    App          Metrics    Dashboard
       |
       | /health
       |
 Recovery Monitor
       |
  Docker SDK
       |
  Restart Application
```

## 5. Project Structure

```text
SentinelOps/
│
├── app/
│   ├── app.py
│   ├── requirements.txt
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── script.js
│
├── monitoring/
│   ├── prometheus.yml
│   ├── recovery_monitor.py
│   └── Dockerfile
│
├── screenshots/
│
├── docs/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── Dockerfile
├── docker-compose.yml
└── .gitignore
```

## 6. Key Features

### Application Monitoring
- Application health monitoring through a Flask health endpoint.
- Application uptime tracking.
- HTTP request counting.
- Prometheus metrics exposure.

### Automated Recovery
- Docker restart policy for recovering from application process crashes.
- Custom Python recovery monitor.
- Detection of repeated application health-check failures.
- Automatic container restart request after three consecutive failures.

### Monitoring Dashboard
- Dark-themed operations dashboard.
- Application health status.
- Application uptime.
- HTTP request count.
- Service overview.
- Recovery simulation controls.
- Links to Prometheus and Grafana.

### Continuous Integration
- GitHub Actions workflow.
- Automated Docker image build.
- Application health endpoint testing.

## 7. Application Endpoints

| Endpoint | Description |
|---|---|
| `/` | SentinelOps dashboard |
| `/health` | Checks application health |
| `/metrics` | Exposes Prometheus metrics |
| `/simulate-crash` | Simulates application process crash |
| `/simulate-unhealthy` | Simulates an unhealthy application |
| `/restore-health` | Restores application health |

## 8. Installation and Setup

### Prerequisites

Make sure the following are installed:

- Docker
- Docker Compose
- Git

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### Step 2: Navigate to the Project

```bash
cd SentinelOps
```

### Step 3: Build and Start the Containers

```bash
docker compose up --build -d
```

### Step 4: Verify Running Containers

```bash
docker compose ps
```

## 9. Accessing the Services

Once the containers are running, access the services using the following URLs:

| Service | URL |
|---|---|
| SentinelOps Dashboard | http://localhost:5000 |
| Prometheus | http://localhost:9090 |
| Prometheus Targets | http://localhost:9090/targets |
| Grafana | http://localhost:3000 |

Use the Grafana credentials configured in `docker-compose.yml`.

## 10. Testing and Demonstration

### Check Application Health

```bash
curl http://localhost:5000/health
```

Expected result:

```json
{
  "status": "healthy",
  "application": "SentinelOps"
}
```

### View Application Metrics

```bash
curl http://localhost:5000/metrics
```

### Simulate Application Failure

```bash
curl http://localhost:5000/simulate-unhealthy
```

Check the health endpoint:

```bash
curl -i http://localhost:5000/health
```

The application should return HTTP 503 while the unhealthy state is active.

### Restore Application Health

```bash
curl http://localhost:5000/restore-health
```

### Simulate Application Process Crash

**Warning:** This endpoint intentionally terminates the Flask application process.

```bash
curl http://localhost:5000/simulate-crash
```

Docker's restart policy should restart the application container.

Verify recovery:

```bash
docker compose ps
```

### Monitor Recovery Logs

```bash
docker compose logs -f recovery-monitor
```

The recovery monitor checks application health and requests a restart after three consecutive failures.

## 11. GitHub Actions

SentinelOps uses GitHub Actions for continuous integration.

The workflow performs the following tasks:

1. Checks out the repository.
2. Builds the Docker image.
3. Starts a test container.
4. Tests the application health endpoint.
5. Cleans up the test container.

The workflow validates the application build and health check. It does not perform remote deployment.

## 12. Screenshots

Project screenshots are available in the `screenshots/` directory.

They demonstrate:

- SentinelOps main dashboard.
- Grafana monitoring dashboard.
- Prometheus targets.
- Running Docker containers.
- Application crash recovery.
- Application health recovery.

## 13. Limitations

- The project currently runs in a local Docker environment.
- The GitHub Actions workflow performs build and testing, not remote deployment.
- The recovery monitor uses Docker socket access to restart the application container. This is highly privileged and requires additional security controls in production.
- The dashboard's illustrative uptime trend is not a live Prometheus time-series chart; actual metrics visualization is provided by Grafana.

## 14. Future Enhancements

- Cloud deployment.
- Advanced alerting and notifications.
- Improved security and access control.
- More detailed monitoring and analytics.
- Enhanced automated testing.

## 15. Conclusion

SentinelOps demonstrates how containerization, monitoring, continuous integration, and automated recovery can work together to improve application reliability.

By combining Flask, Docker, Docker Compose, Prometheus, Grafana, and a custom Python recovery monitor, the project provides a practical demonstration of DevOps principles and self-healing application behavior.

---

**Project Name:** SentinelOps — Self-Healing Deployment Platform
