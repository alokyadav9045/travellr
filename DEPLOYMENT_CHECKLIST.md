# 🚀 Production Deployment Checklist

Use this checklist before deploying to production.

## 📋 Pre-Deployment

### Environment Configuration
- [ ] All environment variables set in `.env`
- [ ] Production MongoDB URI configured
- [ ] Production Redis URL configured  
- [ ] JWT secret is strong (32+ characters)
- [ ] Stripe live keys configured
- [ ] Cloudinary production credentials set
- [ ] Email service credentials configured
- [ ] Production client URL set
- [ ] Run `npm run validate:env` passes

### Security
- [ ] All secrets rotated from development
- [ ] No hardcoded credentials in code
- [ ] CORS origins properly configured
- [ ] Rate limiting configured
- [ ] Helmet.js enabled
- [ ] HTTPS/SSL certificates ready
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection verified
- [ ] XSS protection enabled

### Database
- [ ] Database indexes created (`npm run db:indexes create`)
- [ ] Database backup strategy in place
- [ ] Connection pooling configured
- [ ] Read replicas configured (if needed)
- [ ] Database monitoring enabled

### Performance
- [ ] Redis cache configured and tested
- [ ] Cache warming strategy in place
- [ ] Static assets optimized
- [ ] Images compressed
- [ ] Gzip/Brotli compression enabled
- [ ] CDN configured (Cloudflare/CloudFront)
- [ ] Load testing completed
- [ ] Response times < 200ms average

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code coverage > 80%
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Logging configured properly

### Dependencies
- [ ] All dependencies updated
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Unused dependencies removed
- [ ] Package-lock.json committed

## 🐳 Docker Deployment

### Docker Setup
- [ ] Dockerfiles optimized
- [ ] Multi-stage builds used
- [ ] .dockerignore configured
- [ ] Environment variables in docker-compose
- [ ] Health checks configured
- [ ] Resource limits set

### Docker Commands
```bash
# Build images
docker-compose build

# Test locally
docker-compose up

# Push to registry
docker-compose push

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

### Kubernetes Setup
- [ ] Kubernetes cluster ready
- [ ] kubectl configured
- [ ] Secrets created
- [ ] ConfigMaps created
- [ ] Persistent volumes provisioned
- [ ] Ingress controller installed
- [ ] SSL certificates configured

### Kubernetes Commands
```bash
# Create secrets
kubectl create secret generic travellr-secrets --from-env-file=.env

# Deploy
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
kubectl get hpa

# View logs
kubectl logs -f deployment/travellr-backend
```

## 🌐 DNS & Domain

### Domain Configuration
- [ ] Domain purchased
- [ ] DNS A records configured
- [ ] DNS CNAME records configured
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] www redirect configured
- [ ] DNS propagation verified

### DNS Records
```
A     @           -> <SERVER_IP>
A     www         -> <SERVER_IP>
CNAME api         -> <SERVER_IP>
CNAME admin       -> <SERVER_IP>
```

## 📧 Email Service

### Email Configuration
- [ ] Email service provider configured
- [ ] SMTP credentials verified
- [ ] SPF record configured
- [ ] DKIM configured
- [ ] DMARC configured
- [ ] Email templates tested
- [ ] Unsubscribe links working
- [ ] Transactional emails working

## 💳 Payment Integration

### Stripe Configuration
- [ ] Stripe account in production mode
- [ ] Live API keys configured
- [ ] Webhook endpoint configured
- [ ] Webhook secret set
- [ ] Test payments completed
- [ ] Refund process tested
- [ ] Payout schedule configured

## 📊 Monitoring & Logging

### Monitoring Setup
- [ ] Application monitoring (New Relic/DataDog)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot/Pingdom)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] Server monitoring
- [ ] Alerting configured

### Logging Setup
- [ ] Centralized logging (ELK/CloudWatch)
- [ ] Log levels configured
- [ ] Log rotation configured
- [ ] Error logs monitored
- [ ] Access logs enabled

## 🔄 CI/CD Pipeline

### CI/CD Configuration
- [ ] GitHub Actions workflow configured
- [ ] Automated tests in pipeline
- [ ] Automated builds in pipeline
- [ ] Automated deployments configured
- [ ] Rollback strategy defined
- [ ] Staging environment set up

## 💾 Backup & Recovery

### Backup Strategy
- [ ] Automated database backups
- [ ] Backup retention policy (7 days)
- [ ] Backup testing completed
- [ ] Restore procedure documented
- [ ] Backup monitoring enabled
- [ ] Off-site backups configured

### Backup Commands
```bash
# Create backup
npm run backup:create

# List backups
npm run backup:list

# Restore backup
npm run backup:restore <backup-name>
```

## 🔒 Security Hardening

### Server Security
- [ ] Firewall configured
- [ ] SSH key authentication only
- [ ] Root login disabled
- [ ] Fail2ban installed
- [ ] Auto-updates enabled
- [ ] Security patches applied

### Application Security
- [ ] Rate limiting enabled
- [ ] DDoS protection (Cloudflare)
- [ ] API authentication working
- [ ] File upload restrictions
- [ ] Input sanitization
- [ ] Output encoding

## 📱 Frontend Deployment

### Frontend Checklist
- [ ] Environment variables set
- [ ] API endpoints configured
- [ ] Analytics integrated (Google Analytics)
- [ ] SEO meta tags configured
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] PWA configured
- [ ] Offline mode tested
- [ ] Performance optimized

### Build Commands
```bash
cd frontend
npm run build
npm start
```

## 🧪 Testing

### Test Checklist
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Load tests completed
- [ ] Security tests completed
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness tested
- [ ] Accessibility tested

### Test Commands
```bash
# Run all tests
make test

# Load testing
npm run load-test

# Health check
./scripts/health-check.sh
```

## 📈 Performance Optimization

### Performance Checklist
- [ ] Database queries optimized
- [ ] Indexes created
- [ ] Cache strategy implemented
- [ ] API response times < 200ms
- [ ] Frontend bundle size < 200KB
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] CDN configured

## 🎯 Post-Deployment

### Verification Steps
- [ ] All services running
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] Database connected
- [ ] Redis connected
- [ ] Email sending working
- [ ] Payments working
- [ ] Webhooks receiving
- [ ] Monitoring active

### Monitoring Commands
```bash
# Check health
./scripts/health-check.sh

# Monitor performance
npm run monitor

# View logs
docker-compose logs -f
kubectl logs -f deployment/travellr-backend
```

## 🚨 Incident Response

### Incident Checklist
- [ ] Incident response plan documented
- [ ] On-call rotation defined
- [ ] Escalation procedures defined
- [ ] Communication plan ready
- [ ] Rollback procedure tested
- [ ] Emergency contacts listed

### Quick Rollback
```bash
# Docker rollback
docker-compose down
docker-compose pull <previous-tag>
docker-compose up -d

# Kubernetes rollback
kubectl rollout undo deployment/travellr-backend
```

## 📞 Team Communication

### Deployment Communication
- [ ] Team notified of deployment window
- [ ] Stakeholders informed
- [ ] Support team briefed
- [ ] Documentation updated
- [ ] Changelog published
- [ ] Users notified (if needed)

## ✅ Final Verification

### Go-Live Checklist
- [ ] All above sections completed
- [ ] Test credentials removed
- [ ] Debug mode disabled
- [ ] Verbose logging disabled
- [ ] Maintenance page ready
- [ ] Support team ready
- [ ] Monitoring dashboard open
- [ ] Emergency contacts available

### Post-Launch Monitoring (First 24 Hours)
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor server resources
- [ ] Monitor user activity
- [ ] Check logs regularly
- [ ] Verify backups running
- [ ] Test critical flows
- [ ] Collect user feedback

## 🎉 Launch!

When all items are checked:

```bash
# Final validation
npm run validate:env

# Deploy
make deploy-production

# Monitor
npm run monitor
```

---

## 📱 Emergency Contacts

**Technical Lead**: _____________  
**DevOps Lead**: _____________  
**Database Admin**: _____________  
**Security Lead**: _____________  

## 📚 Documentation

- Setup Guide: `SETUP_COMPLETE.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- API Documentation: `/api-docs`
- Testing Guide: `TESTING_GUIDE.md`

---

**Date**: _____________  
**Deployed By**: _____________  
**Version**: _____________  
**Deployment Type**: [ ] Staging [ ] Production

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
