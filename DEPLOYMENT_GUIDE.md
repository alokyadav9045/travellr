# 🚀 Travellr Deployment Guide

Complete guide for deploying Travellr to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Monitoring tools set up
- [ ] CDN configured
- [ ] Error tracking enabled

---

## 🐳 Docker Deployment

### Local Production Build

1. **Build images**:
```bash
docker-compose -f docker-compose.yml build
```

2. **Start services**:
```bash
docker-compose -f docker-compose.yml up -d
```

3. **Check services**:
```bash
docker-compose ps
docker-compose logs -f
```

### Docker Hub Deployment

1. **Tag images**:
```bash
docker tag travellr-backend:latest yourusername/travellr-backend:latest
docker tag travellr-frontend:latest yourusername/travellr-frontend:latest
```

2. **Push to registry**:
```bash
docker push yourusername/travellr-backend:latest
docker push yourusername/travellr-frontend:latest
```

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (AWS EKS, GKE, or AKS)
- kubectl configured
- Docker images pushed to registry

### 1. Create Secrets

```bash
# MongoDB credentials
kubectl create secret generic mongodb-secret \
  --from-literal=username=admin \
  --from-literal=password=your-password

# Application secrets
kubectl create secret generic travellr-secrets \
  --from-literal=mongo-uri=mongodb://user:pass@mongodb:27017/travellr \
  --from-literal=redis-url=redis://:pass@redis:6379 \
  --from-literal=jwt-secret=your-jwt-secret \
  --from-literal=stripe-secret=sk_live_your-stripe-key \
  --from-literal=cloudinary-name=your-cloudinary-name \
  --from-literal=cloudinary-key=your-cloudinary-key \
  --from-literal=cloudinary-secret=your-cloudinary-secret
```

### 2. Deploy MongoDB

```bash
kubectl apply -f k8s/mongodb-deployment.yaml
```

### 3. Deploy Redis

```bash
kubectl apply -f k8s/redis-deployment.yaml
```

### 4. Deploy Backend

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

### 5. Deploy Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

### 6. Deploy Ingress

```bash
kubectl apply -f k8s/ingress.yaml
```

### Monitor Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check logs
kubectl logs -f deployment/travellr-backend

# Check autoscaling
kubectl get hpa
```

---

## 🌍 AWS Deployment

### AWS ECS with Fargate

1. **Create ECR repositories**:
```bash
aws ecr create-repository --repository-name travellr-backend
aws ecr create-repository --repository-name travellr-frontend
```

2. **Push images to ECR**:
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag travellr-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/travellr-backend:latest
docker tag travellr-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/travellr-frontend:latest

# Push
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/travellr-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/travellr-frontend:latest
```

3. **Create ECS cluster**:
```bash
aws ecs create-cluster --cluster-name travellr-cluster
```

4. **Create task definitions** (use AWS Console or CLI)

5. **Create services**:
```bash
aws ecs create-service \
  --cluster travellr-cluster \
  --service-name travellr-backend \
  --task-definition travellr-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE
```

### AWS Elastic Beanstalk

1. **Install EB CLI**:
```bash
pip install awsebcli
```

2. **Initialize application**:
```bash
cd backend
eb init -p docker travellr-backend

cd ../frontend
eb init -p docker travellr-frontend
```

3. **Create environments**:
```bash
eb create travellr-backend-prod
eb create travellr-frontend-prod
```

4. **Deploy**:
```bash
eb deploy
```

---

## 🔵 DigitalOcean Deployment

### Using App Platform

1. **Connect GitHub repository**
2. **Configure build settings**:
   - Backend: `backend/Dockerfile`
   - Frontend: `frontend/Dockerfile`
3. **Set environment variables**
4. **Deploy**

### Using Droplets

1. **Create droplet** (Ubuntu 22.04)
2. **SSH into droplet**
3. **Install Docker**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

4. **Clone repository**:
```bash
git clone https://github.com/yourusername/travellr.git
cd travellr
```

5. **Deploy**:
```bash
docker-compose up -d
```

---

## 📦 Heroku Deployment

### Backend

1. **Create Heroku app**:
```bash
heroku create travellr-backend
```

2. **Set buildpack**:
```bash
heroku buildpacks:set heroku/nodejs
```

3. **Add MongoDB addon**:
```bash
heroku addons:create mongolab:sandbox
```

4. **Set environment variables**:
```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set STRIPE_SECRET_KEY=your-key
# ... other variables
```

5. **Deploy**:
```bash
git subtree push --prefix backend heroku main
```

### Frontend

1. **Create app**:
```bash
heroku create travellr-frontend
```

2. **Deploy**:
```bash
git subtree push --prefix frontend heroku main
```

---

## 🔒 SSL/TLS Setup

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d travellr.com -d www.travellr.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

Update `nginx/nginx.conf`:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/travellr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/travellr.com/privkey.pem;
    # ... rest of config
}
```

---

## 🗄️ Database Setup

### MongoDB Atlas

1. **Create cluster** at mongodb.com/cloud/atlas
2. **Whitelist IP addresses**
3. **Create database user**
4. **Get connection string**:
```
mongodb+srv://username:password@cluster.mongodb.net/travellr
```

### Backup Strategy

```bash
# Daily backups
mongodump --uri="mongodb://..." --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://..." /backups/20240101
```

---

## 📊 Monitoring & Logging

### Application Monitoring

**Sentry** for error tracking:
```bash
# Backend
npm install @sentry/node
```

**PM2** for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name travellr-backend
pm2 startup
pm2 save
```

### Server Monitoring

**New Relic**:
```bash
npm install newrelic
```

**Datadog**:
```bash
npm install dd-trace
```

---

## 🚦 Health Checks & Uptime

### Uptime Monitoring

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring
- **StatusCake**: Global monitoring

### Health Check Endpoint

Already implemented at `/api/health`:
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow already configured at `.github/workflows/ci-cd.yml`

### Manual Deployment

```bash
# Build
docker build -t travellr-backend ./backend
docker build -t travellr-frontend ./frontend

# Test
npm test

# Deploy
docker push registry/travellr-backend:latest
kubectl rollout restart deployment/travellr-backend
```

---

## 🎯 Performance Optimization

### Frontend
- Enable Next.js Image Optimization
- Configure CDN (Cloudflare, AWS CloudFront)
- Enable browser caching
- Minimize JavaScript bundles

### Backend
- Enable Redis caching
- Use connection pooling
- Implement rate limiting
- Optimize database queries
- Enable compression

### Database
- Create proper indexes
- Use aggregation pipelines
- Implement read replicas
- Monitor slow queries

---

## 📈 Scaling Strategies

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Use Kubernetes HPA

### Vertical Scaling
- Upgrade server resources
- Optimize application code
- Use caching extensively

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **HTTPS Only**: Enforce SSL/TLS
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Sanitize all inputs
5. **Dependencies**: Keep updated
6. **Monitoring**: Log security events
7. **Backups**: Regular automated backups
8. **Firewall**: Configure properly
9. **CORS**: Restrict origins
10. **Headers**: Set security headers

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via domain
- [ ] SSL certificate valid
- [ ] Database connected
- [ ] Redis connected (if enabled)
- [ ] Email service working
- [ ] File uploads working (Cloudinary)
- [ ] Payments working (Stripe)
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Logs accessible
- [ ] Health checks passing
- [ ] Performance acceptable
- [ ] Security scan passed

---

## 🆘 Troubleshooting

### Application Won't Start
```bash
# Check logs
docker-compose logs backend
kubectl logs deployment/travellr-backend

# Check environment variables
docker-compose config
kubectl describe deployment/travellr-backend
```

### Database Connection Issues
```bash
# Test connection
mongosh "mongodb://..."

# Check network
kubectl get services
docker network inspect travellr-network
```

### High Memory Usage
```bash
# Check resource usage
docker stats
kubectl top pods

# Restart services
docker-compose restart
kubectl rollout restart deployment/travellr-backend
```

---

## 📞 Support

- **Documentation**: Check all .md files
- **API Docs**: https://your-domain.com/api-docs
- **Issues**: GitHub Issues
- **Email**: support@travellr.com

---

**Deployment Complete! 🎉**

Remember to monitor your application and set up alerts for critical issues.
