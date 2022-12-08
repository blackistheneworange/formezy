#client build
FROM node:16 as formezy-client
WORKDIR /client
COPY . .
RUN npm install
RUN npm run build
RUN ls
RUN ls dist
RUN ls /client/dist
RUN ls /client/dist/assets
RUN rm -r node_modules