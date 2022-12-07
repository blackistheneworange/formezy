#client build
FROM node:16
WORKDIR /client
COPY client/ .
RUN npm install
RUN npm run build
RUN rm -r node_modules

#jar build
FROM openjdk:19-jdk-alpine as build

WORKDIR /app
# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

RUN ls src
RUN ls src/main/resources/static
# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)
# CMD [ "sh", "-c", "java -Dserver.port=$PORT -Djava.security.egd=file:/dev/./urandom -jar app.jar" ]

#### Stage 2: A minimal docker image with command to run the app 
FROM openjdk:19-jdk-alpine

ARG DEPENDENCY=/app/target/dependency

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

EXPOSE 8002

ENTRYPOINT ["java","-cp","app:app/lib/*","com.apps.formezy.Application"]