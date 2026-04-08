# 第一阶段：构建前端
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# 第二阶段：运行后端
FROM node:20-alpine
WORKDIR /app
COPY backend/ ./backend/
COPY package.json ./
COPY --from=builder /app/frontend/dist ./frontend/dist
EXPOSE 3000
CMD ["node", "backend/server.js"]
