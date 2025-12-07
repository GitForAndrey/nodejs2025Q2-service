
# Use Node.js 20.11.1 base image
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma
COPY prisma ./prisma/

# Install dependencies
RUN npm install && npm cache clean --force

# Copy all source code
COPY . .

# Expose port
EXPOSE 4000

# Use the start:dev:docker script
CMD ["npm", "run", "start:dev:docker"]