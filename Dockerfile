# Usando a imagem oficial do Node.js
FROM node:23-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do front-end
COPY . .

# Expor a porta onde o front-end vai rodar
EXPOSE 3000

# Definir o comando para rodar o front-end
CMD ["npm", "run", "dev"]
