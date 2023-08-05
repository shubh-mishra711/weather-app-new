FROM node:13.12.0-alpine
WORKDIR app
COPY package.json ./
RUN npm install --silent
RUN npm install --save @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
COPY . .
EXPOSE 3000
CMD ["npm", "start"]