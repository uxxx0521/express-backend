# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required dependencies for bcrypt & other native modules
RUN apk add --no-cache python3 make g++

# Copy package.json and install dependencies
COPY package.json package-lock.json ./

# Force bcrypt to be rebuilt inside the Alpine container
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy the rest of the app files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "run", "devStart"]
