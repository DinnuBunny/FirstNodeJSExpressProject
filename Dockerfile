# From Base Image node 
FROM node:16

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copying all the files from your file system to container file system
COPY package.json .

# Install all Dependencies
RUN npm install

# COPY other files to
COPY ./ .

# EXPOSE THE PORT
EXPOSE 3005

# Command to run the app when it is initialed image
CMD ["npm", "start"]