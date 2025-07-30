# Étape 1 : Build de l'application
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar

# Étape 2 : Image d'exécution
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copier seulement le JAR généré
COPY --from=builder /app/build/libs/*.jar app.jar

# Démarrage de l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
