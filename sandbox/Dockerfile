FROM eclipse-temurin:21-jdk

RUN apt-get update \
    && apt-get install -y --no-install-recommends php-cli \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 10001 worker \
    && mkdir -p /var/lib/java-werkstatt/queue \
    && chown -R worker:worker /var/lib/java-werkstatt

WORKDIR /opt/java-werkstatt
COPY worker.php .
USER worker
ENV JAVA_WORKER_QUEUE=/var/lib/java-werkstatt/queue
CMD ["php", "/opt/java-werkstatt/worker.php"]
