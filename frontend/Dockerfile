FROM node:20 as angular
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
RUN rm -rf /usr/share/nginx/html/*
COPY --from=angular /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
