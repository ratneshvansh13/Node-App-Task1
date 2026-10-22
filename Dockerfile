# Built Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Stage 2: Production Stage
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

copy --from=builder --chown=node:node /app/package*.json ./
copy --from=builder --chown=node:node /app/node_modules ./node_modules
copy --from=builder --chown=node:node /app/server.js ./server.js

USER node

EXPOSE 3000

USER node
CMD ["node", "server.js"]
