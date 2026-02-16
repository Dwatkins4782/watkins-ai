# Start backend in background and test billing
Write-Host "=== Starting Backend and Testing Billing ===" -ForegroundColor Cyan

# Kill any existing backend
Write-Host "`n1. Stopping any existing backend..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object { 
    (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object LocalPort -eq 4000) 
} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start backend in separate window
Write-Host "2. Starting backend..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-Location 'c:\watkins-ai\backend'
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\watkins-ai\backend; npm run start:dev" -PassThru

# Wait for backend to start
Write-Host "3. Waiting for backend to start (10 seconds)..." -ForegroundColor Yellow
$waited = 0
while ($waited -lt 15) {
    Start-Sleep -Seconds 1
    $waited++
    $proc = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "✅ Backend is ready!" -ForegroundColor Green
        break
    }
}

if ($waited -ge 15) {
    Write-Host "❌ Backend failed to start" -ForegroundColor Red
    exit 1
}

# Run test
Write-Host "`n4. Running billing test..." -ForegroundColor Cyan
Set-Location 'c:\watkins-ai'
.\test-billing.ps1

Write-Host "`n5. Test complete. Backend is still running in separate window." -ForegroundColor Green
Write-Host "To stop backend, close the PowerShell window or run: Get-Process -Id $($backend.Id) | Stop-Process" -ForegroundColor Gray
