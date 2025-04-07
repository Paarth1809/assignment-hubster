# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the project
RUN npm run build

# Expose port (default Vite port is 5173)
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
