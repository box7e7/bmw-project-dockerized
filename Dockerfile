# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy Prisma schema and migrations if they exist
COPY prisma ./prisma

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN yarn build

# Stage 2: Set up production environment with Puppeteer support
FROM node:18 

WORKDIR /app

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Update the package repository and install necessary dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    openssh-client \
    autossh \
    cron \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Add Google's signing key and the Chrome repository
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

# Install Google Chrome Stable
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set up cron jobs
RUN mkdir -p /app/scripts

# Create crontab file with environment sourcing and full paths
RUN echo "3 */4 * * * . /etc/cron.env && cd /app/scripts && /usr/local/bin/node getCookies.js >> /var/log/cron.log 2>&1\n\
3 */6 * * * . /etc/cron.env && cd /app/scripts && /usr/local/bin/node getCookies_towbook18.js >> /var/log/cron.log 2>&1\n\
*/10 * * * * . /etc/cron.env && cd /app/scripts && /bin/bash getBmwJobs.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/app-cron

# Give execution rights on the cron job and set proper permissions
RUN chmod 0644 /etc/cron.d/app-cron

# Create log file and give proper permissions
RUN touch /var/log/cron.log && chmod 0644 /var/log/cron.log

# Save environment variables for cron jobs
RUN env | grep -E 'PATH|NODE|HOME|PUPPETEER' > /etc/cron.env

# Apply cron job
RUN crontab /etc/cron.d/app-cron

# Copy the .ssh directory from the build context (host machine) to /root/.ssh in the container
COPY .ssh /root/.ssh

# Ensure correct permissions for the .ssh directory and files
RUN chmod 700 /root/.ssh && chmod 600 /root/.ssh/*

COPY --from=builder /app /app

# Install production dependencies
RUN yarn install --frozen-lockfile --production

# Expose the port that Next.js listens on
EXPOSE 3000

CMD ["/bin/sh","/app/start_with_ssh_tunnel.sh"]
