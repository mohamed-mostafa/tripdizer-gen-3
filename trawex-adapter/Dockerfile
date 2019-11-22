FROM node:10-alpine
RUN mkdir -p /opt/tripdizer/trawex-adapter/node_modules
WORKDIR /opt/tripdizer/trawex-adapter
COPY package*.json ./
USER node
RUN npm install
COPY . .
EXPOSE 80
CMD [ "npm", "start" ]