FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir docker==7.1.0

COPY monitoring/recovery_monitor.py .

CMD ["python", "-u", "recovery_monitor.py"]
