FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci
RUN npm run prisma:generate

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
