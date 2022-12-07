FROM node:16
WORKDIR /app
COPY /app/client .
RUN npm install
RUN npm run build
RUN rm -r node_modules

FROM maven:3.6.3-jdk-11
WORKDIR /app
COPY . .
RUN rm -r client
#RUN mkdir -p src/main/resources/static
#COPY --from=frontend /frontend/build src/main/resources/static
RUN mvn clean verify
FROM openjdk:19-jdk-alpine
COPY --from=app /app/target/app-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8002
RUN adduser -D user
USER user
CMD [ "sh", "-c", "java -Dserver.port=$PORT -Djava.security.egd=file:/dev/./urandom -jar app.jar" ]