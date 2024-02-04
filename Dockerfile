FROM node:20-alpine

# Create app directory
WORKDIR /opt/bezier-werewolf-server

# Install app
COPY conf/config.json .
COPY package*.json .
COPY dist .
RUN npm ci --omit=dev \
	&& rm package-lock.json \
	&& npm pkg delete scripts \
	&& npm pkg delete devDependencies \
	&& npm pkg delete files \
	&& npm pkg delete bin \
	&& npm pkg set main=index.js

# Expose app
EXPOSE 8080
CMD [ "node", "cli.js" ]
