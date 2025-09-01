#!/bin/bash

# Go to src/app folder
cd "$(pwd)/src/app" || exit

# Get the absolute path of the app folder
APP_DIR=$(pwd)

echo "Creating symlinks inside $APP_DIR ..."

# Remove old symlinks if they exist
rm -rf "$APP_DIR/line" "$APP_DIR/packing" "$APP_DIR/page.tsx"

# Create new symlinks
ln -s "$APP_DIR/v2/line" "$APP_DIR/line"
ln -s "$APP_DIR/v2/packing" "$APP_DIR/packing"
ln -s "$APP_DIR/v2/sewing/page.tsx" "$APP_DIR/page.tsx"

echo "✅ Symlinks created successfully:"
ls -l "$APP_DIR" | grep -E 'line|packing|page.tsx'
