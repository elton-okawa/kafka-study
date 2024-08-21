FROM node:22.4.0-alpine as base

WORKDIR /usr/app
COPY ./src ./src
COPY .env ./
COPY tsconfig.* ./
COPY package* ./
RUN npm install
RUN npm run build

FROM node:22.4.0-alpine

USER node
EXPOSE 3000

WORKDIR /usr/app
COPY --from=base --chmod=u+x /usr/app/dist ./dist
COPY --from=base --chmod=u+x /usr/app/package.json ./
RUN npm install --production
CMD 'npm' 'run' 'start:prd'