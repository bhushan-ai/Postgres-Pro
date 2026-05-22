FROM node:20

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]