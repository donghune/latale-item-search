FROM node:20-alpine
WORKDIR /app
COPY server.js index.html ./
COPY datas/ ./datas/
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]