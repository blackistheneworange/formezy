#client build
FROM node:16
WORKDIR /client
COPY client/ .
RUN npm install
RUN npm run build
RUN rm -r node_modules

#jar build
FROM openjdk:19-jdk-alpine

WORKDIR /app
# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package -DskipTests

COPY --from=app /app/target/app-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8002
# CMD [ "sh", "-c", "java -Dserver.port=$PORT -Djava.security.egd=file:/dev/./urandom -jar app.jar" ]

ENTRYPOINT ["java","-cp","app:app/lib/*","com.apps.formezy.Application"]