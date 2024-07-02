FROM node:18.12 as build-stage


RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

COPY . .

RUN pnpm run build

# production stage
FROM node:18.12 as production-stage

RUN npm install -g pnpm

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install --production

EXPOSE 3004

CMD ["node", "/app/main.js"]
