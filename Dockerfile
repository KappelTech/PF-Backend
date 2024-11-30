# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on (if the app runs on 3000, adjust if necessary)
EXPOSE 3000

# Command to run your app
CMD ["node", "server.ts"]
