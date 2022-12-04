### Client build ###
#latest nodejs version to use
FROM node:16
#Create app directory
WORKDIR /app

# Install app dependencies
# where available (npm@5+)
COPY package.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN apt-get update

# Bundle app source
COPY . .

# Perform client build
RUN npm run build && rm -r node_modules

