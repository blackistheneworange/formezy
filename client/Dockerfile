#client build
FROM node:16 as formezy-client
WORKDIR /client
COPY . .
RUN npm install
RUN npm run build
RUN rm -r node_modules