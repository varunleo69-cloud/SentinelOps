from flask import Flask, jsonify, Response, render_template
from prometheus_client import Counter, Gauge, generate_latest
import os
import time

app = Flask(__name__)

REQUEST_COUNT = Counter(
    "sentinel_http_requests_total",
    "Total HTTP requests"
)

APP_UPTIME = Gauge(
    "sentinel_app_uptime_seconds",
    "Application uptime in seconds"
)

START_TIME = time.time()
APP_HEALTHY = True


@app.route("/")
def home():
    REQUEST_COUNT.inc()
    APP_UPTIME.set(time.time() - START_TIME)
    return render_template("index.html")


@app.route("/health")
def health():
    if not APP_HEALTHY:
        return jsonify({
            "status": "unhealthy",
            "application": "SentinelOps",
            "reason": "Simulated application failure"
        }), 503

    return jsonify({
        "status": "healthy",
        "application": "SentinelOps"
    }), 200


@app.route("/simulate-unhealthy")
def simulate_unhealthy():
    global APP_HEALTHY
    APP_HEALTHY = False
    return jsonify({"message": "Application marked unhealthy"}), 200


@app.route("/restore-health")
def restore_health():
    global APP_HEALTHY
    APP_HEALTHY = True
    return jsonify({"message": "Application restored"}), 200


@app.route("/metrics")
def metrics():
    APP_UPTIME.set(time.time() - START_TIME)
    return Response(generate_latest(), mimetype="text/plain")


@app.route("/simulate-crash")
def simulate_crash():
    os._exit(1)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
