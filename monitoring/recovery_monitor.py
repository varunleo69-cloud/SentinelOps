
import time
import urllib.request
import urllib.error
import docker

HEALTH_URL = "http://app:5000/health"
CONTAINER_NAME = "sentinel-app"

CHECK_INTERVAL = 10
FAILURE_THRESHOLD = 3

client = docker.from_env()

consecutive_failures = 0

print("SentinelOps Recovery Monitor started", flush=True)

while True:
    try:
        with urllib.request.urlopen(HEALTH_URL, timeout=5) as response:
            if response.status == 200:
                print("Application healthy", flush=True)
                consecutive_failures = 0

    except Exception as error:
        consecutive_failures += 1
        print(
            f"Health check failed: {error}. "
            f"Failures: {consecutive_failures}/{FAILURE_THRESHOLD}",
            flush=True
        )

    if consecutive_failures >= FAILURE_THRESHOLD:
        try:
            print("Unhealthy application detected!", flush=True)

            container = client.containers.get(CONTAINER_NAME)

            print("Restarting application container...", flush=True)
            container.restart()

            print("Restart command sent successfully.", flush=True)

            consecutive_failures = 0

            # Give the application time to start again.
            time.sleep(20)

        except Exception as error:
            print(f"Recovery failed: {error}", flush=True)
            time.sleep(CHECK_INTERVAL)

    else:
        time.sleep(CHECK_INTERVAL)
