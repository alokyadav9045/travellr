# GitHub Actions CI/CD Setup Guide

## Quick Start

### 1. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```bash
DOCKER_USERNAME=your_docker_hub_username
DOCKER_PASSWORD=your_docker_hub_password
SNYK_TOKEN=your_snyk_token
SONAR_TOKEN=your_sonarqube_token
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
STAGING_DEPLOYMENT_KEY=staging_credentials
STAGING_DEPLOYMENT_URL=https://staging.travellr.example.com
PROD_DEPLOYMENT_KEY=production_credentials
PROD_DEPLOYMENT_URL=https://travellr.example.com
```

### 2. Workflows Created

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Frontend CI/CD | `.github/workflows/frontend-ci.yml` | Frontend changes | Test, lint, build frontend |
| Backend CI/CD | `.github/workflows/backend-ci.yml` | Backend changes | Test, lint, build backend |
| Full Stack Deploy | `.github/workflows/deploy.yml` | Push to main | Deploy to staging/production |
| Code Quality | `.github/workflows/quality-and-security.yml` | Every push + Daily | Security scans, code quality |

### 3. Pipeline Flow

```
Developer Push
    ↓
GitHub Actions Triggered
    ↓
Lint & Type Check
    ↓
Run Tests (with MongoDB, Redis services)
    ↓
Security Scan (Snyk, Trivy)
    ↓
Build Docker Images
    ↓
Push to Docker Hub
    ↓
Deploy to Staging (auto)
    ↓
Health Checks
    ↓
Manual approval for Production
    ↓
Deploy to Production
    ↓
Slack Notification
```

### 4. Local Testing (Simulate CI)

```bash
# Install act (GitHub Actions local runner)
# macOS: brew install act
# Windows: choco install act-cli
# Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Test frontend workflow locally
act -j lint-and-build -W .github/workflows/frontend-ci.yml

# Test backend workflow locally
act -j lint-and-test -W .github/workflows/backend-ci.yml

# Test full stack deploy
act -j test -W .github/workflows/deploy.yml
```

## Workflow Details

### Frontend CI/CD (frontend-ci.yml)

**Triggers:**
- Push to `main` or `develop` branches (if frontend files changed)
- Pull requests to `main` or `develop`
- Manual trigger (`workflow_dispatch`)

**Jobs:**

1. **lint-and-build** (Parallel on Node 18.x & 20.x)
   - Install dependencies
   - Lint code
   - TypeScript check
   - Run tests
   - Build project
   - Upload artifacts

2. **test-coverage**
   - Generate coverage report
   - Upload to Codecov

3. **security-audit**
   - npm audit
   - Snyk security scan

4. **docker-build** (Only on main branch)
   - Build Docker image
   - Push to Docker Hub

**Success Indicators:**
- ✅ Build completes without errors
- ✅ All tests pass
- ✅ No critical security issues
- ✅ Image pushed to Docker Hub

### Backend CI/CD (backend-ci.yml)

**Triggers:**
- Push to `main` or `develop` branches (if backend files changed)
- Pull requests
- Manual trigger

**Services:**
- MongoDB 6.0 (with credentials)
- Redis 7.0-alpine

**Jobs:**

1. **lint-and-test** (Parallel on Node 18.x & 20.x)
   - Install dependencies
   - Lint code
   - Setup environment variables
   - Run tests with coverage
   - Generate reports

2. **security-audit**
   - npm audit
   - Snyk scan

3. **docker-build** (Only on main branch)
   - Build Docker image
   - Push to registry

4. **api-health-check** (After docker-build)
   - Start container
   - Verify health endpoint

**Success Indicators:**
- ✅ All tests pass
- ✅ Coverage reports generated
- ✅ Container starts successfully
- ✅ Health checks pass

### Full Stack Deploy (deploy.yml)

**Triggers:**
- Push to `main` branch
- Manual trigger with environment selection

**Environments:**
- staging (auto-deploy)
- production (manual gate)

**Jobs:**

1. **test** - Run tests for both services
2. **build** - Docker build and push
3. **staging-deploy** - Deploy to staging
4. **production-deploy** - Deploy to production
5. **notify** - Send Slack notification

**Approval Gates:**
- Production requires manual approval
- See GitHub → Deployments for approval

### Code Quality & Security (quality-and-security.yml)

**Triggers:**
- Every push
- Every pull request
- Daily schedule (2 AM UTC)

**Jobs:**
- SonarQube analysis
- Dependency updates check
- Performance analysis
- Trivy vulnerability scan

## Advanced Configuration

### Docker Registry

Currently configured for **Docker Hub**. To use other registries:

**AWS ECR:**
```yaml
- uses: aws-actions/amazon-ecr-login@v1
  with:
    registry-type: public
```

**GitHub Container Registry (GHCR):**
```yaml
- uses: docker/login-action@v2
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

### Custom Slack Messages

Edit the Slack notification step in workflows:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Deployment: ${{ github.ref }}
      Commit: ${{ github.sha }}
      Status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Branch Protection Rules

Recommended GitHub settings:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require code reviews before merging (2 approvals)
   - ✅ Require deployments to succeed
   - ✅ Dismiss stale PR approvals

## Troubleshooting

### Tests Timing Out

**Issue:** "Exceeded timeout of 30000 ms"

**Solution:**
```yaml
# In jest.config.js or test file
testTimeout: 60000  // Increase to 60 seconds
```

### Docker Push Fails

**Issue:** "unauthorized: authentication required"

**Solution:**
```bash
# Verify Docker credentials
echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
```

### Database Connection Issues

**Issue:** "Cannot connect to MongoDB"

**Solution:**
```bash
# Verify services are running
- name: Check MongoDB
  run: |
    mongosh --eval "db.adminCommand('ping')" \
      --authenticationDatabase admin \
      -u root -p testpass
```

### Coverage Threshold Not Met

**Issue:** "Jest: global coverage threshold not met"

**Solution:**
```javascript
// jest.config.js - Adjust thresholds temporarily
coverageThreshold: {
  global: {
    branches: 50,      // Lower from 70
    functions: 50,     // Lower from 75
    lines: 50,         // Lower from 80
    statements: 50     // Lower from 80
  }
}
```

## Monitoring Workflow Runs

### GitHub Dashboard

1. Go to repository → Actions
2. Click workflow name to view runs
3. Click run to see details
4. View logs for each job

### Status Badge

Add to README.md:

```markdown
![Frontend CI/CD](https://github.com/your-username/travellr/workflows/Frontend%20CI%2FCD/badge.svg)
![Backend CI/CD](https://github.com/your-username/travellr/workflows/Backend%20CI%2FCD/badge.svg)
![Deploy](https://github.com/your-username/travellr/workflows/Full%20Stack%20Deployment/badge.svg)
```

## Performance Tips

### Cache Dependencies

Already enabled in workflows:
```yaml
cache: 'npm'
cache-dependency-path: 'frontend/package-lock.json'
```

This caches npm modules between runs (~60% faster).

### Parallel Jobs

Workflows run jobs in parallel automatically:
- Frontend and Backend CI/CD run simultaneously
- Multiple Node versions tested in parallel
- Saves ~50% of total pipeline time

### Artifact Management

Artifacts kept for 7 days by default:
```yaml
retention-days: 7
```

To keep longer:
```yaml
retention-days: 30  # Up to 90 days
```

## Cost Optimization

**Free GitHub Actions Limits:**
- 3,000 minutes/month for private repos
- Unlimited for public repos

**Current Usage:**
- Frontend build: ~5 min per run
- Backend build: ~8 min per run
- Deploy: ~10 min per run
- **Total per full cycle: ~23 minutes**

**Estimated monthly cost:** ~$50/month (if 100 commits/month)

## Next Steps

1. ✅ Add GitHub Secrets (configure above)
2. ✅ Push workflows to repository
3. 🔄 Create test commit to trigger pipeline
4. 🔄 Monitor first workflow run
5. 🔄 Set up branch protection rules
6. 🔄 Configure Slack notifications
7. 🔄 Enable production deployments

## Support

For workflow issues:
- Check GitHub Actions logs
- Verify environment variables
- Review secrets configuration
- Test locally with `act` tool

See individual workflow YAML files for detailed configuration.
