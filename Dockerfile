FROM node:lts-alpine

RUN apk --no-cache add sqlite bash

# Create app directory
WORKDIR /usr/src/app

# Copy package*.json and npm install
COPY package*.json ./
RUN npm install

# Copy the host $PROJECT_DIR
COPY . .

# npm link creates a symbolic link in the container's PATH
RUN npm link