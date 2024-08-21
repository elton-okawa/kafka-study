FROM node:22.4.0-alpine AS build
WORKDIR /usr/app
COPY ./public ./public
COPY ./src ./src
COPY package* angular.json tsconfig* ./
RUN npm install
RUN npm run build


FROM nginx:1.27.0-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/app/dist/app /usr/share/nginx/html
