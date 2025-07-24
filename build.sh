# cat build.sh
#!/bin/bash

APP_NAME="dppikiosk"
PORT=3001

echo "=== Step 0: Check and free port $PORT if used ==="
PID=$(lsof -ti :$PORT)

if [ -n "$PID" ]; then
  echo "Port $PORT is in use by PID $PID. Killing it..."
  kill -9 $PID
else
  echo "Port $PORT is free."
fi

echo "=== Step 1: Build project ==="
pnpm build || { echo "Build failed! Exiting."; exit 1; }

echo "=== Step 2: Delete existing PM2 app: $APP_NAME ==="
pm2 delete $APP_NAME || echo "No existing PM2 process found for $APP_NAME."

echo "=== Step 3: Start app with PM2 ==="
pm2 start "pnpm start" --name $APP_NAME --interpreter none || { echo "PM2 start failed!"; exit 1; }

echo "=== Step 4: Setup PM2 startup (auto boot on server restart) ==="
STARTUP_CMD=$(pm2 startup | grep -oP '(?<=sudo ).*')

if [ -n "$STARTUP_CMD" ]; then
  echo "Running PM2 startup command: sudo $STARTUP_CMD"
  sudo $STARTUP_CMD
else
  echo "Warning: Could not parse PM2 startup command. Please run 'pm2 startup' manually if needed."
fi

echo "=== Step 5: Save PM2 process list ==="
pm2 save

echo "✅ All steps completed successfully!"
