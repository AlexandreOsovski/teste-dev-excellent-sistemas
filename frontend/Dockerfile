# # Etapa de build
# FROM node:20 AS build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN ng build --prod

# # Etapa de produção
# FROM node:20
# WORKDIR /app
# COPY --from=build /app/dist/frontend ./dist
# RUN npm install -g serve

# # Expor a porta do frontend
# EXPOSE 5000

# # Comando para rodar o serve
# CMD ["serve", "-s", "dist", "-l", "5000"]
