FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY index.js ./
COPY server ./server

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "index.js"]