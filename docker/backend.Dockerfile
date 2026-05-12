FROM node:20-bookworm-slim

WORKDIR /app

# install openssl for prisma
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

# IMPORTANT
RUN npm install --legacy-peer-deps

COPY . .

# generate prisma client during build
RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]