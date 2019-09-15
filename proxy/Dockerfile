FROM node:11.15.0-alpine
WORKDIR /app
COPY [ "package.json", "yarn.lock", "./" ]
COPY . /app
RUN yarn
RUN yarn build
EXPOSE 8080
EXPOSE 443
CMD [ "node", "dist/index.js" ]