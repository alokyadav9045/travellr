# Makefile for Travellr Platform

.PHONY: help install dev build test clean deploy

# Colors
CYAN := \033[0;36m
GREEN := \033[0;32m
RED := \033[0;31m
RESET := \033[0m

help: ## Show this help message
	@echo "$(CYAN)Travellr Platform - Available Commands$(RESET)"
	@echo "========================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	@echo "$(CYAN)Installing dependencies...$(RESET)"
	cd backend && npm install
	cd frontend && npm install
	@echo "$(GREEN)✅ Dependencies installed$(RESET)"

install-backend: ## Install backend dependencies
	@echo "$(CYAN)Installing backend dependencies...$(RESET)"
	cd backend && npm install

install-frontend: ## Install frontend dependencies
	@echo "$(CYAN)Installing frontend dependencies...$(RESET)"
	cd frontend && npm install

# Development
dev: ## Start development servers (backend + frontend)
	@echo "$(CYAN)Starting development servers...$(RESET)"
	make -j2 dev-backend dev-frontend

dev-backend: ## Start backend development server
	cd backend && npm run dev

dev-frontend: ## Start frontend development server
	cd frontend && npm run dev

# Database
db-seed: ## Seed database with sample data
	@echo "$(CYAN)Seeding database...$(RESET)"
	cd backend && npm run seed

db-backup: ## Create database backup
	@echo "$(CYAN)Creating database backup...$(RESET)"
	cd backend && npm run backup:create

db-restore: ## Restore database from backup
	@echo "$(CYAN)Restoring database...$(RESET)"
	cd backend && npm run backup:restore

db-indexes: ## Create database indexes
	@echo "$(CYAN)Creating database indexes...$(RESET)"
	cd backend && npm run db:indexes create

# Cache Management
cache-warm: ## Warm Redis cache
	@echo "$(CYAN)Warming cache...$(RESET)"
	cd backend && npm run cache:warm

cache-clear: ## Clear Redis cache
	@echo "$(CYAN)Clearing cache...$(RESET)"
	cd backend && npm run cache:clear

cache-stats: ## Show cache statistics
	cd backend && npm run cache:stats

# Testing
test: ## Run all tests
	@echo "$(CYAN)Running tests...$(RESET)"
	make test-backend
	make test-frontend

test-backend: ## Run backend tests
	@echo "$(CYAN)Running backend tests...$(RESET)"
	cd backend && npm test

test-frontend: ## Run frontend tests
	@echo "$(CYAN)Running frontend tests...$(RESET)"
	cd frontend && npm test

test-e2e: ## Run E2E tests
	@echo "$(CYAN)Running E2E tests...$(RESET)"
	cd frontend && npm run test:e2e

load-test: ## Run load tests
	@echo "$(CYAN)Running load tests...$(RESET)"
	cd backend && npm run load-test

# Code Quality
lint: ## Run linters
	@echo "$(CYAN)Linting code...$(RESET)"
	cd backend && npm run lint
	cd frontend && npm run lint

lint-fix: ## Fix linting issues
	@echo "$(CYAN)Fixing linting issues...$(RESET)"
	cd backend && npm run lint:fix
	cd frontend && npm run lint:fix

validate-env: ## Validate environment variables
	@echo "$(CYAN)Validating environment variables...$(RESET)"
	cd backend && npm run validate:env

# Docker
docker-build: ## Build Docker images
	@echo "$(CYAN)Building Docker images...$(RESET)"
	docker-compose build

docker-up: ## Start Docker containers
	@echo "$(CYAN)Starting Docker containers...$(RESET)"
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "$(CYAN)Stopping Docker containers...$(RESET)"
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-ps: ## List Docker containers
	docker-compose ps

docker-clean: ## Clean Docker resources
	@echo "$(CYAN)Cleaning Docker resources...$(RESET)"
	docker-compose down -v
	docker system prune -f

# Deployment
deploy-staging: ## Deploy to staging
	@echo "$(CYAN)Deploying to staging...$(RESET)"
	git push staging main

deploy-production: ## Deploy to production
	@echo "$(CYAN)Deploying to production...$(RESET)"
	@echo "$(RED)⚠️  Are you sure? This will deploy to production!$(RESET)"
	@read -p "Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		git push production main; \
		echo "$(GREEN)✅ Deployed to production$(RESET)"; \
	else \
		echo "$(RED)Deployment cancelled$(RESET)"; \
	fi

# Monitoring
monitor: ## Start performance monitor
	@echo "$(CYAN)Starting performance monitor...$(RESET)"
	cd backend && npm run monitor

health-check: ## Run health check
	@echo "$(CYAN)Running health check...$(RESET)"
	bash scripts/health-check.sh

# Maintenance
clean: ## Clean build artifacts and dependencies
	@echo "$(CYAN)Cleaning...$(RESET)"
	rm -rf backend/node_modules
	rm -rf frontend/node_modules
	rm -rf backend/.next
	rm -rf frontend/.next
	@echo "$(GREEN)✅ Cleaned$(RESET)"

setup: ## Initial project setup
	@echo "$(CYAN)Setting up Travellr platform...$(RESET)"
	cp backend/.env.example backend/.env || true
	cp frontend/.env.example frontend/.env || true
	make install
	make db-indexes
	make db-seed
	@echo "$(GREEN)✅ Setup complete!$(RESET)"
	@echo "$(CYAN)Next steps:$(RESET)"
	@echo "  1. Update .env files with your credentials"
	@echo "  2. Run 'make dev' to start development servers"

# Production build
build: ## Build for production
	@echo "$(CYAN)Building for production...$(RESET)"
	cd backend && npm run build || echo "No build needed"
	cd frontend && npm run build
	@echo "$(GREEN)✅ Build complete$(RESET)"

# Quick commands
quick-start: ## Quick start (install + seed + dev)
	make install
	make db-seed
	make dev

reset: ## Reset everything (clean + setup)
	make clean
	make setup

# Kubernetes
k8s-deploy: ## Deploy to Kubernetes
	@echo "$(CYAN)Deploying to Kubernetes...$(RESET)"
	kubectl apply -f k8s/

k8s-status: ## Check Kubernetes status
	@echo "$(CYAN)Kubernetes Status:$(RESET)"
	kubectl get pods
	kubectl get services
	kubectl get hpa

k8s-logs: ## View Kubernetes logs
	kubectl logs -f deployment/travellr-backend

k8s-delete: ## Delete Kubernetes resources
	@echo "$(CYAN)Deleting Kubernetes resources...$(RESET)"
	kubectl delete -f k8s/

# Backup
backup-full: ## Full backup (database + files)
	@echo "$(CYAN)Creating full backup...$(RESET)"
	make db-backup
	tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz backend/uploads
	@echo "$(GREEN)✅ Full backup complete$(RESET)"

# Security
security-scan: ## Run security scan
	@echo "$(CYAN)Running security scan...$(RESET)"
	cd backend && npm audit
	cd frontend && npm audit

security-fix: ## Fix security vulnerabilities
	@echo "$(CYAN)Fixing security vulnerabilities...$(RESET)"
	cd backend && npm audit fix
	cd frontend && npm audit fix

# Documentation
docs: ## Generate API documentation
	@echo "$(CYAN)API documentation available at:$(RESET)"
	@echo "http://localhost:5000/api-docs"

# Stats
stats: ## Show project statistics
	@echo "$(CYAN)Project Statistics:$(RESET)"
	@echo "Backend files: $$(find backend/src -type f | wc -l)"
	@echo "Frontend files: $$(find frontend/src -type f | wc -l)"
	@echo "Backend LOC: $$(find backend/src -name '*.js' -exec cat {} \; | wc -l)"
	@echo "Frontend LOC: $$(find frontend/src -name '*.tsx' -o -name '*.ts' -exec cat {} \; | wc -l)"
	@echo "Total tests: $$(find . -name '*.test.js' -o -name '*.test.ts' | wc -l)"

.DEFAULT_GOAL := help
