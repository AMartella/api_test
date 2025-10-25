FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

# Comando per avviare in sviluppo
CMD ["npm", "run", "dev"]
#CMD ["npm", "run", "start"]
