@echo off
title Lucy Anchor Phase 2
echo ===================================================
echo Starting Lucy Anchor Phase 2...
echo ===================================================

echo Checking and installing dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev

pause
