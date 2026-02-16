# Test Billing Endpoint
Write-Host "=== Billing Endpoint Test ===" -ForegroundColor Cyan

# Check if backend is running
$backend = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue
if (!$backend) {
    Write-Host "Backend not running on port 4000" -ForegroundColor Red
    Write-Host "Please start the backend first with: cd backend; npm run start:dev" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Backend is running" -ForegroundColor Green

# Wait a moment to ensure backend is ready
Start-Sleep -Seconds 2

try {
    # Login
    Write-Host "`n1. Logging in..." -ForegroundColor Cyan
    $loginData = '{"email":"test@example.com","password":"password123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $response.token
    Write-Host "✅ Login successful" -ForegroundColor Green
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Get current subscription
    Write-Host "`n2. Getting current subscription..." -ForegroundColor Cyan
    $sub = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/billing/subscription" -Method GET -Headers $headers
    Write-Host "✅ Current plan: $($sub.plan)" -ForegroundColor Green
    
    # Test billing checkout
    Write-Host "`n3. Testing billing checkout (upgrade to STARTER)..." -ForegroundColor Cyan
    $checkout = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/billing/checkout" -Method POST -Body '{"plan":"starter"}' -Headers $headers
    Write-Host "✅ Checkout successful!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $checkout | ConvertTo-Json -Depth 3
    
    # Verify subscription updated
    Write-Host "`n4. Verifying subscription updated..." -ForegroundColor Cyan
    $newSub = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/billing/subscription" -Method GET -Headers $headers
    Write-Host "✅ New plan: $($newSub.plan)" -ForegroundColor Green
    
    if ($newSub.plan -eq "STARTER") {
        Write-Host "`n✅✅✅ ALL TESTS PASSED!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Warning: Plan did not update to STARTER (current: $($newSub.plan))" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    Write-Host "`nStack trace:" -ForegroundColor Yellow
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
}
