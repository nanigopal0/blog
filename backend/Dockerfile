FROM maven:3.9.8-sapmachine-22 AS build
WORKDIR /home/app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21
WORKDIR /home/app
#COPY . .
#RUN chmod +x ./mvnw
#RUN ./mvnw dependency:go-offline
#RUN ./mvnw clean package -DskipTests
#COPY --from=build /target/api-0.0.1-SNAPSHOT.jar colab-blog-api.jar
COPY --from=build /home/app/target/api-0.0.1-SNAPSHOT.jar blog.jar
EXPOSE 8080
ENTRYPOINT [ "java","-jar","/home/app/blog.jar" ]
#EXPOSE 8080
#ENTRYPOINT [ "java","-jar","/home/app/target/api-0.0.1-SNAPSHOT.jar" ]
#ENTRYPOINT [ "java","-jar","colab-blog-api.jar" ]


