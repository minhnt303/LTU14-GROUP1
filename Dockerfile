FROM node:8
WORKDIR /server
COPY package.json /server
RUN npm install
COPY . /server
EXPOSE 3000
CMD [ "npm", "start" ]