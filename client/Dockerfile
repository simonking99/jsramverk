# Use an official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your frontend app runs on (default for React is 3000, adjust if needed)
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]
