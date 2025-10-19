# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-23 AS build
WORKDIR /workspace

# Cache deps early
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Build
COPY src ./src
RUN mvn -q -DskipTests package

# ---- Runtime stage ----
FROM eclipse-temurin:23-jdk
WORKDIR /app

# Install Docker CLI (optional, if needed)
RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

# Copy jar
COPY --from=build /workspace/target/*.jar app.jar

# Expose app port
EXPOSE 8080

# Run as root so Docker access is allowed
USER root

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
