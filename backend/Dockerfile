FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /home/app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /home/app
COPY --from=build /home/app/target/*.jar blog.jar
EXPOSE 8080
ENTRYPOINT [ "java","-jar","/home/app/blog.jar" ]

