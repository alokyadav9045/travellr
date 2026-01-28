# 🔧 Operations Runbook

Essential operations guide for maintaining the Travellr platform.

## 🚨 Emergency Procedures

### Service Down

**Symptoms**: API not responding, 502/503 errors

**Quick Fix**:
```bash
# Check service status
docker-compose ps
kubectl get pods

# Restart services
docker-compose restart backend
kubectl rollout restart deployment/travellr-backend

# Check logs
docker-compose logs --tail=100 backend
kubectl logs -f deployment/travellr-backend
```

### Database Connection Issues

**Symptoms**: "Connection refused", "Timeout" errors

**Fix**:
```bash
# Check MongoDB status
docker-compose ps mongodb
kubectl get pods | grep mongodb

# Restart MongoDB
docker-compose restart mongodb
kubectl rollout restart deployment/mongodb

# Test connection
mongosh "mongodb://localhost:27017/travellr"
```

### High Memory Usage

**Symptoms**: Slow performance, OOM errors

**Fix**:
```bash
# Check memory usage
docker stats
kubectl top pods

# Clear cache
npm run cache:clear

# Restart with clean state
docker-compose restart backend redis
```

### Cache Issues

**Symptoms**: Stale data, inconsistent responses

**Fix**:
```bash
# Clear all cache
npm run cache:clear

# Warm cache
npm run cache:warm

# Check cache stats
npm run cache:stats
```

---

## 📊 Daily Operations

### Morning Checklist
```bash
# 1. Check service health
./scripts/health-check.sh

# 2. Review logs for errors
docker-compose logs --tail=100 backend | grep ERROR

# 3. Check performance metrics
npm run monitor:once

# 4. Verify cache hit rate
npm run cache:stats

# 5. Check backup status
npm run backup:list
```

### Database Maintenance
```bash
# Create daily backup
npm run backup:create

# Clean old backups (keep 7 days)
npm run backup:clean

# Verify indexes
npm run db:indexes list
```

### Cache Management
```bash
# Check cache size
npm run cache:stats

# Warm cache for better performance
npm run cache:warm

# Clear stale cache entries
npm run cache:clear "search:*"
```

---

## 🔄 Routine Tasks

### Weekly Tasks

**Monday**:
- Review error logs
- Check database size
- Update dependencies if needed

**Wednesday**:
- Run security audit
- Review performance metrics
- Check disk space

**Friday**:
- Review backup strategy
- Test restore procedure
- Update documentation

### Monthly Tasks

- Database optimization
- Security patches
- Dependency updates
- Performance review
- Cost optimization review

---

## 📈 Monitoring

### Key Metrics to Watch

**Performance**:
- API response time < 200ms
- Database query time < 50ms
- Cache hit rate > 80%

**Resources**:
- CPU usage < 70%
- Memory usage < 80%
- Disk usage < 80%

**Business**:
- Active users
- Booking conversion rate
- Error rate < 1%

### Monitoring Commands
```bash
# Real-time monitoring
npm run monitor

# One-time check
npm run monitor:once

# Generate report
npm run monitor:report
```

---

## 🔐 Security Operations

### Weekly Security Tasks
```bash
# 1. Scan for vulnerabilities
npm audit
npm run security-scan

# 2. Review access logs
grep "401\|403" logs/access.log

# 3. Check failed login attempts
grep "login.*failed" logs/app.log

# 4. Review API rate limits
grep "rate limit" logs/app.log
```

### Incident Response
1. **Identify**: What's the issue?
2. **Contain**: Isolate affected services
3. **Eradicate**: Fix the root cause
4. **Recover**: Restore services
5. **Document**: Record incident details

---

## 💾 Backup & Recovery

### Backup Procedures

**Daily Automated Backup**:
```bash
# Runs via cron at 2 AM
0 2 * * * cd /app/backend && npm run backup:create
```

**Manual Backup**:
```bash
# Create backup
npm run backup:create

# List backups
npm run backup:list

# Verify backup
ls -lh backups/
```

### Recovery Procedures

**Restore from Backup**:
```bash
# 1. Stop application
docker-compose down backend

# 2. List available backups
npm run backup:list

# 3. Restore
npm run backup:restore backup-2024-01-01T10-00-00

# 4. Start application
docker-compose up -d backend

# 5. Verify
./scripts/health-check.sh
```

**Point-in-Time Recovery**:
```bash
# MongoDB oplog replay
mongorestore --uri="mongodb://..." \
  --oplogReplay \
  --oplogLimit="1704067200:0" \
  /path/to/backup
```

---

## 🚀 Deployment Procedures

### Deploying Updates

**1. Pre-Deployment**:
```bash
# Run tests
make test

# Validate environment
npm run validate:env

# Create backup
npm run backup:create
```

**2. Deploy**:
```bash
# Docker
docker-compose pull
docker-compose up -d

# Kubernetes
kubectl set image deployment/travellr-backend \
  backend=travellr-backend:v2.0.0
```

**3. Post-Deployment**:
```bash
# Health check
./scripts/health-check.sh

# Monitor for 10 minutes
npm run monitor

# Check error logs
docker-compose logs -f backend
```

### Rollback Procedure
```bash
# Docker
docker-compose down
docker-compose pull <previous-version>
docker-compose up -d

# Kubernetes
kubectl rollout undo deployment/travellr-backend
kubectl rollout status deployment/travellr-backend
```

---

## 🔍 Troubleshooting

### High CPU Usage

**Investigate**:
```bash
# Check processes
docker exec travellr-backend top

# Check slow queries
npm run db:indexes analyze

# Profile Node.js
node --prof src/server.js
```

**Fix**:
- Optimize database queries
- Add missing indexes
- Increase cache TTL
- Scale horizontally

### Slow API Responses

**Investigate**:
```bash
# Check response times
npm run monitor:once

# Check database performance
npm run db:indexes analyze

# Check cache hit rate
npm run cache:stats
```

**Fix**:
- Add database indexes
- Warm cache
- Optimize queries
- Enable compression

### Memory Leaks

**Investigate**:
```bash
# Monitor memory over time
watch -n 5 'docker stats --no-stream'

# Check for memory leaks
node --inspect src/server.js
```

**Fix**:
- Review event listeners
- Check for circular references
- Implement connection pooling
- Restart service periodically

---

## 📞 Escalation

### Level 1 (Operations Team)
- Service restarts
- Cache clearing
- Log review
- Basic troubleshooting

### Level 2 (Engineering Team)
- Code issues
- Database optimization
- Performance tuning
- Feature bugs

### Level 3 (Senior Engineering)
- Architecture issues
- Major incidents
- Security breaches
- Data corruption

---

## 📋 Checklists

### Before Maintenance Window
- [ ] Notify users
- [ ] Create backup
- [ ] Prepare rollback plan
- [ ] Test in staging
- [ ] Schedule outside peak hours

### During Maintenance
- [ ] Enable maintenance mode
- [ ] Stop accepting new requests
- [ ] Complete tasks
- [ ] Run tests
- [ ] Verify changes

### After Maintenance
- [ ] Disable maintenance mode
- [ ] Monitor services
- [ ] Check error rates
- [ ] Verify functionality
- [ ] Notify completion

---

## 🛠️ Useful Commands

### Docker
```bash
# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Execute command
docker-compose exec backend [command]

# Check resource usage
docker stats
```

### Kubernetes
```bash
# Get pod info
kubectl get pods
kubectl describe pod [pod-name]

# View logs
kubectl logs -f [pod-name]

# Execute command
kubectl exec -it [pod-name] -- [command]

# Scale deployment
kubectl scale deployment/travellr-backend --replicas=5
```

### Database
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/travellr"

# Check indexes
db.trips.getIndexes()

# Explain query
db.trips.find({}).explain("executionStats")

# Database stats
db.stats()
```

### Redis
```bash
# Connect to Redis
redis-cli

# Check memory
INFO memory

# Get all keys
KEYS *

# Clear cache
FLUSHDB
```

---

## 📚 Reference Links

- [Setup Guide](SETUP_COMPLETE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)
- [API Documentation](http://localhost:5000/api-docs)

---

**Last Updated**: December 2025  
**Maintained By**: DevOps Team  
**Version**: 1.0.0
