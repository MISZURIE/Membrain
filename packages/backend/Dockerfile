FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY prisma ./prisma/
RUN npm install
COPY src ./src/
RUN npm run build
RUN npx prisma generate

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/index.js"]
