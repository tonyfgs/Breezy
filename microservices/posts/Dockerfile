FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json ./
RUN pnpm install --prod
COPY . .
EXPOSE 4003
CMD ["node", "src/index.js"]
