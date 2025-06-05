# server/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci 

# Copy the rest of the app
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "index.js"]