FROM node:18-alpine

# Install Java 21 (latest LTS) + dependencies
RUN apk add --no-cache openjdk21-jre bash curl

# Install Firebase CLI globally
RUN npm install -g firebase-tools

# Set working directory
WORKDIR /app

# Copy your Firebase project files
COPY . .

# Expose emulator ports
EXPOSE 4000 5001 8080 9000 9099 9199

# Start Firebase emulators
CMD ["firebase", "emulators:start", "--only", "firestore,auth,functions", "--project", "demo-project"]