#!/bin/bash

echo "=================================================="
echo "Building Next.js App for GitHub Pages"
echo "=================================================="
echo ""

# Step 1: Backup original next.config.js
echo "1. Backing up original next.config.js..."
if [ -f next.config.js ]; then
    cp next.config.js next.config.backup.js
    echo "   ✓ Backup created: next.config.backup.js"
fi

# Step 2: Use export config
echo ""
echo "2. Switching to export configuration..."
cp next.config.export.js next.config.js
echo "   ✓ Using next.config.export.js"

# Step 3: Build the app
echo ""
echo "3. Building the Next.js app..."
yarn build

if [ $? -eq 0 ]; then
    echo ""
    echo "   ✓ Build successful!"
    echo ""
    echo "=================================================="
    echo "Build Complete!"
    echo "=================================================="
    echo ""
    echo "Output directory: ./out"
    echo "The 'out' directory contains your static site ready for GitHub Pages."
    echo ""
    echo "Next steps:"
    echo "1. Create a GitHub repository"
    echo "2. Copy contents of 'out' directory to repository root"
    echo "3. Push to GitHub"
    echo "4. Enable GitHub Pages in repository settings (use main branch)"
    echo ""
else
    echo ""
    echo "   ✗ Build failed!"
    echo ""
    
    # Restore original config
    if [ -f next.config.backup.js ]; then
        mv next.config.backup.js next.config.js
        echo "   Restored original next.config.js"
    fi
    
    exit 1
fi

# Step 4: Restore original config
echo "4. Restoring original configuration..."
if [ -f next.config.backup.js ]; then
    mv next.config.backup.js next.config.js
    echo "   ✓ Original next.config.js restored"
fi

echo ""
echo "Done!"
