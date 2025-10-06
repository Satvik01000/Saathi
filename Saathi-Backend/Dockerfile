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

# Copy the fat jar produced by Spring Boot
COPY --from=build /workspace/target/*.jar app.jar

# Expose app port
EXPOSE 8080

# Optional: pass extra JVM flags via JAVA_OPTS
ENV JAVA_OPTS=""

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
