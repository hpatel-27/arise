FROM node:lts

# Set working directory
WORKDIR /app

# install node modules
COPY package*.json ./
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .

# Expose the react port
EXPOSE 3000

# Running server command
CMD ["npm", "run", "dev"]