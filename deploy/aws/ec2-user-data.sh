#!/bin/bash
# ==============================================================================
# AlgoCraft Platform - AWS EC2 / Lightsail User Data Bootstrap Script
# Tested on Amazon Linux 2023 and Ubuntu 22.04 / 24.04 LTS
# ==============================================================================
set -e

echo "=== [1/5] Updating packages and installing Docker ==="
if command -v dnf &> /dev/null; then
    # Amazon Linux 2023 / Fedora / RHEL
    dnf update -y
    dnf install -y docker git
    systemctl enable --now docker
    usermod -aG docker ec2-user
elif command -v apt-get &> /dev/null; then
    # Ubuntu / Debian
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin git curl
    systemctl enable --now docker
    usermod -aG docker ubuntu
fi

echo "=== [2/5] Installing Docker Compose CLI ==="
DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m) -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

echo "=== [3/5] Setting up Project Directory ==="
mkdir -p /opt/algocraft
cd /opt/algocraft

# Clone or copy repo here, or pull pre-built image from ECR / Docker Hub
# Example: git clone https://github.com/your-org/algocraft.git .

echo "=== [4/5] Launching AlgoCraft Production Stack ==="
# docker compose -f deploy/aws/docker-compose.prod.yml up -d --build

echo "=== [5/5] Setup Completed Successfully! ==="
