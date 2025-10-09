FROM node:22-alpine

WORKDIR /app

RUN npm install -g json-server

COPY db.json .
COPY public ./public

EXPOSE 3001

CMD ["json-server", "db.json", "--host", "0.0.0.0", "--port", "3001"]