FROM node:12-slim

# Create app directory
WORKDIR /usr/src/app
COPY pack*.json ./

# Build application
RUN npm install
COPY . .
EXPOSE $PORT

# Execute application
CMD [ "npm", "run", "serve"]