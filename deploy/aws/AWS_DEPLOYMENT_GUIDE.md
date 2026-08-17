# ☁️ AWS Deployment Plan for AlgoCraft Platform

This document outlines the production deployment architectures, operational runbooks, and cost-optimized infrastructure options for deploying **AlgoCraft** to Amazon Web Services (AWS).

---

## 🏛️ Architecture Options

```
                    ┌──────────────────────────────────────────────┐
                    │               Amazon Route 53                │
                    │               (Custom Domain)                │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │           AWS Certificate Manager            │
                    │                  (Free SSL)                  │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         │                                                                   │
         ▼                                                                   ▼
┌─────────────────────────────────┐                       ┌─────────────────────────────────────┐
│    OPTION 1: EC2 / Lightsail    │                       │    OPTION 2: Serverless ECS Fargate │
│       (Simple & Cost-Optimal)   │                       │          (High Availability)        │
├─────────────────────────────────┤                       ├─────────────────────────────────────┤
│ • EC2 `t4g.small` or Lightsail  │                       │ • Application Load Balancer (ALB)   │
│ • Nginx Reverse Proxy (Gzip+SSL)│                       │ • AWS ECS Fargate Container Task    │
│ • Docker Compose Multi-Stage    │                       │ • Amazon EFS (SQLite Persistence)   │
│ • Persistent EBS Volume (/data) │                       │ • Amazon CloudWatch Logs & Alarms   │
│ • Cost: ~$5 - $12 / month       │                       │ • Cost: ~$25 - $45 / month          │
└─────────────────────────────────┘                       └─────────────────────────────────────┘
```

---

## 🚀 Option 1: Fast & Cost-Effective (AWS EC2 / Lightsail with Docker Compose)

> **Recommended for individual practice, coding bootcamps, or small teams.**  
> **Estimated Cost**: ~$5/mo (Lightsail 1GB/2GB) or ~$10/mo (`t4g.small` on EC2).

### Step 1: Launch EC2 Instance
1. Go to **AWS Management Console** → **EC2** → **Launch Instance**.
2. **Name**: `algocraft-production`
3. **AMI**: **Amazon Linux 2023** or **Ubuntu 24.04 LTS**
4. **Instance Type**: `t4g.small` (ARM Graviton) or `t3.small` (x86_64) — *2 vCPUs, 2 GB RAM*.
5. **Key Pair**: Create or select your `.pem` key.
6. **Network Settings / Security Group**:
   - Allow **SSH (Port 22)** from your IP.
   - Allow **HTTP (Port 80)** from `0.0.0.0/0`.
   - Allow **HTTPS (Port 443)** from `0.0.0.0/0`.
7. **Storage**: 20 GB gp3 SSD.
8. **User Data**: Paste contents of `deploy/aws/ec2-user-data.sh`.

### Step 2: Deploy Code
SSH into the instance:
```bash
ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>
```

Clone the repository and build:
```bash
cd /opt
sudo git clone <YOUR_GIT_REPO_URL> algocraft
cd algocraft

# Launch container stack with Docker Compose
sudo docker compose -f deploy/aws/docker-compose.prod.yml up -d --build
```

### Step 3: Configure Free Let's Encrypt SSL with Certbot (Optional)
```bash
sudo dnf install -y certbot python3-certbot-nginx   # or apt install certbot python3-certbot-nginx on Ubuntu
sudo certbot --nginx -d yourdomain.com
```

---

## 🏗️ Option 2: High Availability (AWS ECS Fargate + EFS Persistent Volume)

> **Recommended for organizations requiring multi-AZ fault tolerance and zero server management.**

### 1. Build and Push Image to Amazon ECR
```bash
# Authenticate Docker to Amazon ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Create ECR Repository
aws ecr create-repository --repository-name algocraft --region us-east-1

# Build and Tag Image
docker build -t algocraft:latest .
docker tag algocraft:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/algocraft:latest

# Push Image
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/algocraft:latest
```

### 2. Create Amazon EFS for SQLite Persistence
1. Go to **Amazon EFS** → **Create File System**.
2. Select your target **VPC**.
3. Create an Access Point:
   - **Path**: `/algocraft-data`
   - **POSIX User / Group**: `1000 / 1000`
4. Copy the **File System ID** (`fs-XXXXXXX`).

### 3. Register ECS Task Definition & Service
1. Edit `deploy/aws/aws-ecs-task-def.json` and replace `ACCOUNT_ID` and `fs-XXXXXXX`.
2. Register task definition:
   ```bash
   aws ecs register-task-definition --cli-input-json file://deploy/aws/aws-ecs-task-def.json
   ```
3. Create an **ECS Fargate Service** connected to an Application Load Balancer on port 4000.

---

## 🔒 Security Best Practices for AWS Deployment

1. **Sandboxed Subprocess Execution**:
   - Memory limits (`--max-old-space-size=256`, 128MB per Python process).
   - Strict time limits enforced via `child_process.spawn` timers (default 2000ms - 5000ms).
   - Non-root user permissions inside Docker containers.
2. **Database Backups**:
   - Automated S3 daily backup script:
     ```bash
     aws s3 cp /app/server/data/leetcode_offline.db s3://your-backup-bucket/db-backup-$(date +%Y%m%d).db
     ```
3. **Health Monitoring**:
   - Endpoint: `GET /api/health` returns `200 OK` with uptime metadata.
   - Configure AWS Route 53 or CloudWatch synthetic canaries against `/api/health`.

---

## 🛠️ Operational Commands Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Start Stack** | `docker compose -f deploy/aws/docker-compose.prod.yml up -d` |
| **Check Logs** | `docker compose -f deploy/aws/docker-compose.prod.yml logs -f` |
| **Re-sync Problem Bank** | `docker exec -it algocraft-app npm run seed` |
| **Run Test Validator** | `docker exec -it algocraft-app npm run validate` |
| **Restart Stack** | `docker compose -f deploy/aws/docker-compose.prod.yml restart` |
