FROM node

# Create app directory
WORKDIR /usr/src/app
COPY pack*.json ./

RUN npm install
COPY . .
EXPOSE $PORT
CMD [ "npm", "run", "serve"]