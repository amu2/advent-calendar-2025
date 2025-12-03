#!/bin/bash
#
# update-website.sh
# Lokales Build-Script das den gleichen Prozess wie GitHub Actions ausführt
# Verwenden Sie dies zum Testen vor dem Push zu GitHub
#
# Usage:
#   ./update-website.sh           # Build + Test (kein Push)
#   ./update-website.sh --push    # Build + Push zu GitHub

set -e  # Exit on error

COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_BLUE}"
echo "=========================================================="
echo "  TOE Advent Calendar - Local Build Script"
echo "  (Simulates GitHub Actions Workflow)"
echo "=========================================================="
echo -e "${COLOR_RESET}"

PROJECT_DIR="/home/ubuntu/advent_project/website"
cd "$PROJECT_DIR"

# =============================================================================
# Step 1: Convert LaTeX → JSON
# =============================================================================
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo -e "${COLOR_GREEN}Step 1/4: Converting LaTeX to JSON${COLOR_RESET}"
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo

if [ ! -f "convert_tex_to_json.py" ]; then
    echo -e "${COLOR_RED}ERROR: convert_tex_to_json.py not found!${COLOR_RESET}"
    exit 1
fi

python3 convert_tex_to_json.py

if [ ! -f "public/advent_data.json" ]; then
    echo -e "${COLOR_RED}ERROR: public/advent_data.json was not created!${COLOR_RESET}"
    exit 1
fi

echo -e "${COLOR_GREEN}✓ JSON conversion complete!${COLOR_RESET}"
echo

# =============================================================================
# Step 2: Compile LaTeX → PDF
# =============================================================================
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo -e "${COLOR_GREEN}Step 2/4: Compiling LaTeX to PDF${COLOR_RESET}"
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo

# Check if pdflatex is available
if ! command -v pdflatex &> /dev/null; then
    echo -e "${COLOR_YELLOW}WARNING: pdflatex not found. Skipping PDF compilation.${COLOR_RESET}"
    echo -e "${COLOR_YELLOW}Install TeX Live to compile PDFs locally.${COLOR_RESET}"
    echo
else
    # Create output directory
    mkdir -p public/pdfs
    
    # Array of all advent files
    FILES=("advent00" "advent01" "advent02" "advent03" "advent04" "advent05" "advent06" "advent07" "advent08" "advent09" "advent10" "advent11" "advent12" "advent13" "advent14" "advent15" "advent16" "advent17" "advent18" "advent19" "advent20" "advent21" "advent22" "advent23" "advent24" "advent25" "advent31")
    
    SUCCESS_COUNT=0
    TOTAL_COUNT=${#FILES[@]}
    
    # Compile each file twice (for proper indexing)
    for file in "${FILES[@]}"; do
        if [ -f "${file}.tex" ]; then
            echo -e "${COLOR_BLUE}Compiling ${file}.tex...${COLOR_RESET}"
            
            # Pass 1
            pdflatex -interaction=nonstopmode "${file}.tex" > /dev/null 2>&1 || echo "  (pass 1 had warnings)"
            
            # Pass 2 (for indices)
            pdflatex -interaction=nonstopmode "${file}.tex" > /dev/null 2>&1 || echo "  (pass 2 had warnings)"
            
            # Copy PDF to public directory
            if [ -f "${file}.pdf" ]; then
                cp "${file}.pdf" "public/pdfs/"
                echo -e "  ${COLOR_GREEN}✓ ${file}.pdf${COLOR_RESET}"
                ((SUCCESS_COUNT++))
            else
                echo -e "  ${COLOR_RED}✗ ${file}.pdf (compilation failed)${COLOR_RESET}"
            fi
        else
            echo -e "  ${COLOR_YELLOW}⊘ ${file}.tex not found${COLOR_RESET}"
        fi
    done
    
    # Clean up auxiliary files
    rm -f *.aux *.log *.out *.toc *.synctex.gz
    
    echo
    echo -e "${COLOR_GREEN}✓ PDF compilation complete: ${SUCCESS_COUNT}/${TOTAL_COUNT} PDFs created${COLOR_RESET}"
    echo
fi

# =============================================================================
# Step 3: Build Next.js
# =============================================================================
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo -e "${COLOR_GREEN}Step 3/4: Building Next.js${COLOR_RESET}"
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${COLOR_BLUE}Installing dependencies...${COLOR_RESET}"
    yarn install
    echo
fi

# Use export config for static build
if [ -f "next.config.export.js" ]; then
    cp next.config.export.js next.config.js
    echo -e "${COLOR_BLUE}Using next.config.export.js for GitHub Pages${COLOR_RESET}"
fi

# Build
echo -e "${COLOR_BLUE}Building Next.js...${COLOR_RESET}"
yarn build

# Add .nojekyll
touch out/.nojekyll

echo -e "${COLOR_GREEN}✓ Next.js build complete!${COLOR_RESET}"
echo

# =============================================================================
# Step 4: Summary & Next Steps
# =============================================================================
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo -e "${COLOR_GREEN}Build Complete! ✅${COLOR_RESET}"
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
echo
echo "Generated files:"
echo "  • public/advent_data.json ($(wc -l < public/advent_data.json) lines)"
echo "  • public/pdfs/ ($(ls -1 public/pdfs/*.pdf 2>/dev/null | wc -l) PDFs)"
echo "  • out/ ($(du -sh out | cut -f1) total)"
echo

# Handle --push flag
if [ "$1" == "--push" ]; then
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
    echo -e "${COLOR_BLUE}Pushing to GitHub...${COLOR_RESET}"
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
    echo
    
    # Pull first to avoid conflicts
    echo "Pulling latest changes..."
    git pull origin main || echo -e "${COLOR_YELLOW}Warning: Could not pull (you may have local conflicts)${COLOR_RESET}"
    
    # Add all changes
    echo "Adding changes..."
    git add .
    
    # Commit with timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    echo "Committing..."
    git commit -m "Update website: $TIMESTAMP" || echo -e "${COLOR_YELLOW}Nothing to commit${COLOR_RESET}"
    
    # Push
    echo "Pushing to GitHub..."
    git push origin main
    
    echo
    echo -e "${COLOR_GREEN}✓ Pushed to GitHub!${COLOR_RESET}"
    echo -e "${COLOR_BLUE}GitHub Actions will now build and deploy...${COLOR_RESET}"
    echo "Monitor at: https://github.com/amu2/advent-calendar-2025/actions"
    echo
else
    echo "Next steps:"
    echo
    echo "  1. Test locally:"
    echo -e "     ${COLOR_BLUE}yarn dev${COLOR_RESET}"
    echo -e "     → http://localhost:3000"
    echo
    echo "  2. Push to GitHub:"
    echo -e "     ${COLOR_BLUE}git pull origin main${COLOR_RESET}"
    echo -e "     ${COLOR_BLUE}git add .${COLOR_RESET}"
    echo -e "     ${COLOR_BLUE}git commit -m \"Your message\"${COLOR_RESET}"
    echo -e "     ${COLOR_BLUE}git push origin main${COLOR_RESET}"
    echo
    echo "  OR use the --push flag:"
    echo -e "     ${COLOR_BLUE}./update-website.sh --push${COLOR_RESET}"
    echo
fi

echo -e "${COLOR_GREEN}Done! 🎄${COLOR_RESET}"
echo
