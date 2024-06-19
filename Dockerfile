# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY backend/package.json .
RUN npm install


COPY backend/ .

ENV PORT 4800

EXPOSE ${PORT}

# Command to run the application
CMD ["npm", "start"]
