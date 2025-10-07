@echo off
echo 🔧 Safe Git Commit Fix Tool
echo ========================

cd /d "c:\Users\HP\EcoFuelConnect\eco-fuel-connect-app"

echo 📍 Current directory: %CD%

REM Kill any stuck git processes
taskkill /F /IM git.exe /T >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

echo 🔍 Checking git status...
git status

echo.
echo 🔄 Aborting any active rebase...
git rebase --abort

echo.
echo 💾 Creating backup branch...
git branch backup-original-commits

echo.
echo 📋 Current commits:
git log --oneline

echo.
echo 🔄 Resetting to recreate commits with new messages...
git reset --soft HEAD~2

echo.
echo ✅ Re-committing everything with message "All"...
git add .
git commit -m "All"

echo.
echo ✅ Adding UserProfile commit...
git add src/pages/UserProfile.js >nul 2>&1
git add .gitignore >nul 2>&1
git commit -m "UserProfile" >nul 2>&1

echo.
echo 📋 New commit history:
git log --oneline

echo.
echo 🎉 Done! Your commits now have the messages:
echo    - "All" (first commit)
echo    - "UserProfile" (second commit)
echo.
echo 🚀 To push to GitHub: git push --force-with-lease origin main
echo 💡 If needed, restore with: git checkout backup-original-commits
echo.
pause