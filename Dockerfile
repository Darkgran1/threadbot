FROM node:12-slim

# Create app directory
WORKDIR /usr/src/app
COPY . .

# Build application
RUN npm install
RUN npm run-script build

#COPY . .
EXPOSE $PORT

# Execute application
CMD [ "npm", "run", "serve"]