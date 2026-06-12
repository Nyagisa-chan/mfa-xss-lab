FROM node:26-bookworm-slim

# Install OpenSSH Server
RUN apt-get update && \
    apt-get install -y openssh-server && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configure SSH daemon for port 2275
RUN mkdir /var/run/sshd
RUN sed -i 's/^#Port 22/Port 2275/' /etc/ssh/sshd_config
# Explicitly allow password authentication
RUN sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Create the required user and set the password
RUN useradd -m -s /bin/bash analyst && \
    echo "analyst:blue_team_rocks" | chpasswd

# Prepare the blue team log directory
RUN mkdir -p /opt/admin/logs
# Copy static logs from ./logs directory into the container
COPY ./logs/ /opt/admin/logs/

# Copy nginx.conf file to the container
COPY nginx.conf /home/analyst/nginx.conf-backup

# Ensure permissions allow read access
RUN chmod -R 755 /opt/admin/logs

# Set up the Node.js Application
WORKDIR /usr/src/app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Create a startup script to run both SSH and the Node app
RUN echo '#!/bin/bash\n/usr/sbin/sshd\nexec node app.js' > /start.sh && \
    chmod +x /start.sh

# Expose the requested custom ports
EXPOSE 3075 2275

# Run the startup script
CMD ["/start.sh"]
