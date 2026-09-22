# Stage 1: Build JAR using Maven & JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run with non-root security user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

COPY --from=builder /app/target/app.jar app.jar

# Expose default port
EXPOSE 8080

# Launch with dynamic Render port support
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
