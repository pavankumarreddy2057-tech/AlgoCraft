# ☁️ AWS Deployment Plan for AlgoCraft Platform

This document outlines production deployment architectures, operational runbooks, and SSL configuration for **AlgoCraft** on Amazon Web Services (AWS).

---

## 🛑 Resolving `NoInstallationError("Could not find a usable 'nginx' binary")`

If you encounter this error when running `certbot --nginx`, it means **Nginx is running inside Docker rather than as a system package on the host OS**. 

Choose one of the two solutions below:

### Solution A: Standalone Certbot Mode (Recommended for Docker)

1. **Ensure required directories exist on the host**:
   ```bash
   sudo mkdir -p /var/www/certbot
   sudo mkdir -p /etc/letsencrypt
   ```

2. **Temporarily stop Docker or run Standalone Certbot**:
   ```bash
   # Option A1: Stop docker container on port 80 briefly (takes 5 seconds)
   sudo docker compose -f deploy/aws/docker-compose.prod.yml down

   # Request SSL certificate for your domain (replace yourdomain.com and your-email)
   sudo certbot certonly --standalone -d yourdomain.com -m your-email@example.com --agree-tos -n

   # Restart Docker containers (SSL certificates are mounted at /etc/letsencrypt)
   sudo docker compose -f deploy/aws/docker-compose.prod.yml up -d
   ```

3. **Or Option A2: Webroot Challenge without stopping Docker**:
   ```bash
   sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com -m your-email@example.com --agree-tos -n
   ```

4. **Auto-Renewal via Crontab**:
   Add to `sudo crontab -e`:
   ```cron
   0 3 * * * certbot renew --quiet && docker exec algocraft-nginx nginx -s reload
   ```

---

### Solution B: Host Nginx Mode (If you prefer Nginx directly on the EC2 OS)

If you want Nginx installed directly on the Amazon Linux host machine:
```bash
# 1. Install Nginx on Amazon Linux 2023 host
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# 2. Run Certbot with Nginx plugin
sudo certbot --nginx -d yourdomain.com

# 3. Proxy to AlgoCraft on port 4000
```
In `/etc/nginx/conf.d/algocraft.conf`:
```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Reload Nginx:
```bash
sudo systemctl restart nginx
```

---

## 🏛️ Deployment Architecture Options

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

## 🛠️ Operational Commands Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Start Stack** | `sudo docker compose -f deploy/aws/docker-compose.prod.yml up -d` |
| **Check Logs** | `sudo docker compose -f deploy/aws/docker-compose.prod.yml logs -f` |
| **Re-sync Problem Bank** | `sudo docker exec -it algocraft-app npm run seed` |
| **Run Test Validator** | `sudo docker exec -it algocraft-app npm run validate` |
| **Restart Stack** | `sudo docker compose -f deploy/aws/docker-compose.prod.yml restart` |
