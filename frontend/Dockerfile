FROM node:lts AS build

# Set working directory
WORKDIR /app

# install node modules
COPY package*.json ./
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]