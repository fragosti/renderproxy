FROM node:11.15.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN npm install -g -s --no-progress yarn && \
    yarn && \
    yarn build
COPY . .
EXPOSE 8080
EXPOSE 443
CMD [ "yarn", "start" ]