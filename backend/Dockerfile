FROM node:lts
# Set working directory
WORKDIR /app

# install node modules
COPY package*.json ./
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .

# Generate prisma client
RUN npx prisma generate

# Expose the backend port
EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate dev && npm run start"]