FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Install missing ChromaDB dependency
RUN npm install @chroma-core/default-embed

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
