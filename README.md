# SentinelOps — Self-Healing Application

## Project Overview

SentinelOps is a Docker-based self-healing application designed to demonstrate application monitoring, health checking, automated recovery, and continuous integration and deployment (CI/CD).

The project uses Flask for the application, Docker for containerization, Prometheus for metrics collection, Grafana for visualization, and a Python recovery monitor to detect and recover from application failures.

GitHub Actions automates the build and testing process, publishes Docker images to GitHub Container Registry (GHCR), and uses a self-hosted GitHub Actions runner to deploy the latest image to the local environment.

## Objectives

- Build and containerize a Flask application.
- Monitor application health and performance.
- Collect application metrics using Prometheus.
- Visualize monitoring data using Grafana.
- Detect application failures through automated health checks.
- Recover unhealthy application containers automatically.
- Implement CI/CD using GitHub Actions.
- Publish Docker images to GitHub Container Registry.
- Automate local deployment using a self-hosted runner.

## Technologies Used

| Technology | Purpose |
|---|---|
| Python | Application and recovery monitor |
| Flask | Web application framework |
| Docker | Containerization |
| Docker Compose | Multi-container management |
| Prometheus | Metrics collection |
| Grafana | Monitoring dashboards |
| GitHub Actions | CI/CD automation |
| GitHub Container Registry | Docker image storage |
| Self-hosted Runner | Local automated deployment |
| HTML, CSS, JavaScript | Frontend interface |

## System Architecture

The project consists of the following components:

1. **Flask Application:** Provides the web interface, health endpoint, metrics endpoint, and failure simulation endpoints.
2. **Docker:** Runs the application and supporting services in containers.
3. **Prometheus:** Collects application metrics from the `/metrics` endpoint.
4. **Grafana:** Displays monitoring information through dashboards.
5. **Recovery Monitor:** Periodically checks the application's health endpoint and restarts the application container after consecutive failures.
6. **GitHub Actions:** Builds and tests the Docker image whenever code is pushed to the main branch.
7. **GitHub Container Registry:** Stores the successfully built Docker images.
8. **Self-hosted Runner:** Runs the deployment job on the local Ubuntu environment and updates the application container.

## Project Structure

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
├── .gitignore
└── README.md
```

## Main Features

### 1. Application Health Monitoring

The Flask application provides a health endpoint:

```text
GET /health
```

It returns the current application health status.

### 2. Prometheus Metrics

The application exposes metrics through:

```text
GET /metrics
```

Metrics include:

- `sentinel_http_requests_total`
- `sentinel_app_uptime_seconds`

Prometheus periodically scrapes these metrics.

### 3. Grafana Dashboard

Grafana provides a visual monitoring interface for application metrics.

The dashboard includes:

- HTTP request count
- Application uptime
- Monitoring visualizations

### 4. Automatic Recovery

The Python recovery monitor periodically checks the Flask application's health endpoint.

If the application fails three consecutive health checks, the monitor attempts to restart the application container through the Docker API.

Docker Compose also uses a restart policy to restart containers when their processes exit unexpectedly.

### 5. Failure Simulation

The application provides endpoints to demonstrate failure and recovery:

| Endpoint | Purpose |
|---|---|
| `/simulate-crash` | Simulates an application process crash |
| `/simulate-unhealthy` | Simulates an unhealthy application response |
| `/restore-health` | Restores application health |

### 6. Continuous Integration

GitHub Actions automatically:

- Checks out the source code.
- Builds the Docker image.
- Starts a test container.
- Checks application startup.
- Tests the homepage.
- Tests the health endpoint.
- Verifies Prometheus metrics.

### 7. Docker Image Publishing

After successful tests on pushes to the `main` branch, GitHub Actions publishes Docker images to GitHub Container Registry.

Images are published with:

- `latest` tag
- Git commit SHA tag

Image repository:

```text
ghcr.io/varunleo69-cloud/sentinelops
```

### 8. Automated Deployment

A GitHub self-hosted runner installed in the local Ubuntu environment performs deployment after the CI and image-publishing job succeeds.

The deployment process:

1. Checks out the repository.
2. Pulls the latest Docker image from GHCR.
3. Updates the existing application container using Docker Compose.
4. Checks the application health endpoint.

The self-hosted runner must be online and have Docker access for automatic deployment to work.

## CI/CD Workflow

```text
Developer pushes code to GitHub
              |
              v
       GitHub Actions
              |
              v
       Build Docker Image
              |
              v
         Run Tests
              |
              v
       Publish to GHCR
              |
              v
     Self-hosted Runner
              |
              v
      Pull Latest Image
              |
              v
      Deploy with Docker
              |
              v
       Health Verification
```

Pull requests run the build and testing job. Automatic publishing and deployment are configured for pushes to the `main` branch.

## Installation and Setup

### Prerequisites

- Ubuntu or WSL Ubuntu
- Docker Engine
- Docker Compose
- Git
- GitHub account

### 1. Clone the Repository

```bash
git clone https://github.com/varunleo69-cloud/SentinelOps.git
cd SentinelOps
```

### 2. Start the Application

```bash
docker compose up -d --build
```

### 3. Check Running Containers

```bash
docker compose ps
```

### 4. Access the Services

| Service | URL |
|---|---|
| Flask Application | http://localhost:5000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |
| Application Health | http://localhost:5000/health |
| Application Metrics | http://localhost:5000/metrics |

## Testing and Recovery

### Check Application Health

```bash
curl http://localhost:5000/health
```

### Check Prometheus Metrics

```bash
curl http://localhost:5000/metrics
```

### View Container Status

```bash
docker compose ps
```

### View Recovery Monitor Logs

```bash
docker logs sentinel-recovery-monitor
```

### Simulate an Unhealthy Application

```bash
curl http://localhost:5000/simulate-unhealthy
```

The recovery monitor checks the application periodically and attempts recovery after three consecutive failed health checks.

Restore application health using:

```bash
curl http://localhost:5000/restore-health
```

### Simulate a Process Crash

```bash
curl http://localhost:5000/simulate-crash
```

Docker's restart policy is configured to restart the application after its process exits.

## GitHub Repository

Source code:

https://github.com/varunleo69-cloud/SentinelOps

Docker image:

https://github.com/varunleo69-cloud/SentinelOps/pkgs/container/sentinelops

## Limitations

- The recovery monitor currently monitors the Flask application.
- The recovery monitor does not independently monitor Prometheus or Grafana health.
- Docker restart policies handle container process exits, while the custom recovery monitor handles repeated application health-check failures.
- Automatic deployment depends on the local self-hosted runner being online.
- The project demonstrates self-healing for its configured application rather than providing a general-purpose deployment platform.

## Future Enhancements

- Add monitoring for additional services.
- Improve recovery logging and alert notifications.
- Add persistent monitoring data storage.
- Extend automated testing.
- Add more detailed recovery analytics.

## Conclusion

SentinelOps demonstrates how containerization, monitoring, automated recovery, and CI/CD can work together to improve application reliability.

By combining Docker, Flask, Prometheus, Grafana, Python, GitHub Actions, and GitHub Container Registry, the project provides a practical implementation of a self-healing application with automated local deployment.
