#!/bin/bash

# Haste Conform Studio - Development Setup Script
# This script installs all dependencies needed for local development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Haste Conform Studio - Setup Script  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check for Node.js
echo -e "${YELLOW}Checking for Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or use nvm: https://github.com/nvm-sh/nvm"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version 18 or higher is required.${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}Node.js $(node -v) found${NC}"

# Check for npm
echo -e "${YELLOW}Checking for npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}npm $(npm -v) found${NC}"

# Link to Vercel project (west-monroe serves haste.nyc)
echo ""
echo -e "${YELLOW}Linking Vercel project...${NC}"
if [ ! -d ".vercel" ]; then
    vercel link --yes --project west-monroe --scope jordantaylorfullers-projects 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Linked to Vercel project west-monroe${NC}"
    else
        echo -e "${YELLOW}Warning: Could not link Vercel project. Run 'vercel link' manually.${NC}"
    fi
else
    echo -e "${GREEN}Vercel project already linked${NC}"
fi

# Install dependencies
echo ""
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm install

# Check for .env.local
echo ""
echo -e "${YELLOW}Checking environment configuration...${NC}"
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Creating .env.local from .env.example...${NC}"
        cp .env.example .env.local
        echo -e "${GREEN}.env.local created${NC}"
        echo -e "${YELLOW}NOTE: Please update .env.local with your actual Stripe keys${NC}"
    else
        echo -e "${YELLOW}No .env.example found. Skipping environment setup.${NC}"
    fi
else
    echo -e "${GREEN}.env.local already exists${NC}"
fi

# Success message
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!                       ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Available commands:"
echo -e "  ${BLUE}npm run dev${NC}      - Start development server"
echo -e "  ${BLUE}npm run build${NC}    - Build for production"
echo -e "  ${BLUE}npm run lint${NC}     - Run ESLint"
echo -e "  ${BLUE}npm run preview${NC}  - Preview production build"
echo -e "  ${BLUE}npm run server${NC}   - Start API server (for Stripe)"
echo ""

# Check if Stripe keys need to be configured
if [ -f ".env.local" ]; then
    if grep -q "pk_test_your_publishable_key_here" .env.local 2>/dev/null; then
        echo -e "${YELLOW}Warning: Stripe keys not configured in .env.local${NC}"
        echo -e "Update the following in .env.local:"
        echo -e "  - VITE_STRIPE_PUBLISHABLE_KEY"
        echo -e "  - VITE_STRIPE_PRICE_MONTHLY"
        echo -e "  - VITE_STRIPE_PRICE_YEARLY"
        echo -e "  - STRIPE_SECRET_KEY"
        echo ""
    fi
fi

echo -e "Run ${BLUE}npm run dev${NC} to start the development server."
