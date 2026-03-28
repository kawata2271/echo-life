FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx tsc
CMD ["node", "dist/schedulers/dailyBatch.js"]
