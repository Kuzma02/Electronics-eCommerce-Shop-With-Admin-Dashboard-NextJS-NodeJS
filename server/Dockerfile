# Usando a imagem oficial do Node.js
FROM node:23-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar os arquivos do servidor (API)
COPY . .

# Expor a porta onde a API vai rodar
EXPOSE 3001

# Rodar a aplicação (presumindo que o comando de start seja node app.js)
CMD ["node", "app.js"]
