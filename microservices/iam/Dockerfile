FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
CMD ["node", "dist/index.js"]
