#client build
FROM node:16
WORKDIR /client
COPY client/ .
RUN npm install
RUN npm run build
RUN ls
RUN rm -r node_modules