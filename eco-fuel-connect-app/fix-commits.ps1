# Safe Git Commit Message Update Script
# This script will backup your current state before making changes

Write-Host "🔒 Creating backup of current state..." -ForegroundColor Yellow

# Create a backup branch first
git branch backup-before-rebase

# Check if we're in a rebase state
$rebaseDir = ".git/rebase-merge"
if (Test-Path $rebaseDir) {
    Write-Host "⚠️ Detected active rebase. Aborting safely..." -ForegroundColor Yellow
    git rebase --abort
}

# Get current commit hashes
$commits = git log --oneline --format="%H %s"
Write-Host "📝 Current commits:" -ForegroundColor Green
$commits

# Check if we have exactly 2 commits
$commitCount = ($commits | Measure-Object).Count
if ($commitCount -ne 2) {
    Write-Host "❌ Expected 2 commits, found $commitCount. Stopping for safety." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Safe to proceed. Creating new commit messages..." -ForegroundColor Green

# Method 1: Using git filter-branch (safest)
try {
    # Backup current HEAD
    $currentHead = git rev-parse HEAD
    Write-Host "📍 Current HEAD: $currentHead" -ForegroundColor Cyan
    
    # Create commit message mapping
    $oldCommit1 = "314a470"
    $oldCommit2 = "67471ba"
    
    # Use git replace to temporarily change commit messages
    Write-Host "🔄 Step 1: Changing first commit message to 'All'..." -ForegroundColor Yellow
    
    # Reset soft to before both commits
    git reset --soft HEAD~2
    
    # Re-commit everything with new message "All"
    git add .
    git commit -m "All"
    
    Write-Host "✅ First commit recreated with message 'All'" -ForegroundColor Green
    
    # Add UserProfile.js and commit with "UserProfile" message
    Write-Host "🔄 Step 2: Adding UserProfile commit..." -ForegroundColor Yellow
    
    # Ensure UserProfile.js is tracked
    if (Test-Path "src/pages/UserProfile.js") {
        git add src/pages/UserProfile.js
        git add .gitignore  # Include any .gitignore changes
        git commit -m "UserProfile"
        Write-Host "✅ UserProfile commit created" -ForegroundColor Green
    } else {
        Write-Host "⚠️ UserProfile.js not found, skipping..." -ForegroundColor Yellow
    }
    
    # Show new commit history
    Write-Host "📋 New commit history:" -ForegroundColor Green
    git log --oneline
    
    Write-Host "🚀 Ready to push! Use: git push --force-with-lease origin main" -ForegroundColor Cyan
    Write-Host "💡 If something goes wrong, restore with: git checkout backup-before-rebase" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Error occurred: $_" -ForegroundColor Red
    Write-Host "🔄 Restoring from backup..." -ForegroundColor Yellow
    git checkout backup-before-rebase
    Write-Host "✅ Restored to backup state" -ForegroundColor Green
}