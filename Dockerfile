FROM node:18-alpine

# Create app directory
WORKDIR /opt/bezier-werewolf

# Install app
COPY conf/config.json ./
COPY package*.json ./
RUN npm ci --production && rm package*.json
COPY dist .

# Expose app
EXPOSE 8080
CMD [ "node", "cli.js" ]
