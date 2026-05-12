FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set registry https://registry.npmjs.org/

RUN npm ci

RUN npm install @tailwindcss/oxide-linux-x64-gnu --no-save

COPY . .

RUN npm run build


FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]