# Comprehensive API Endpoint Testing Script
Write-Host "`n=== WATKINS AI - API ENDPOINT TESTING ===" -ForegroundColor Cyan
Write-Host "Testing all backend endpoints systematically`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:4000/api/v1"
$results = @()

# Test 1: Auth - Login
Write-Host "[1/10] Testing Authentication..." -ForegroundColor Yellow
try {
    $loginData = '{"email":"test@example.com","password":"password123"}'
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $response.token
    $tenantId = $response.user.tenantId
    $headers = @{ Authorization = "Bearer $token" }
    $results += @{ Test = "Auth - Login"; Status = "✅ PASS"; Details = "Token received" }
    Write-Host "  ✅ Login successful" -ForegroundColor Green
} catch {
    $results += @{ Test = "Auth - Login"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Stores - List
Write-Host "[2/10] Testing Stores - List..." -ForegroundColor Yellow
try {
    $stores = Invoke-RestMethod -Uri "$baseUrl/stores" -Method GET -Headers $headers
    $results += @{ Test = "Stores - List"; Status = "✅ PASS"; Details = "Found $($stores.Count) stores" }
    Write-Host "  ✅ Listed stores: $($stores.Count) found" -ForegroundColor Green
} catch {
    $results += @{ Test = "Stores - List"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Stores - Create
Write-Host "[3/10] Testing Stores - Create..." -ForegroundColor Yellow
try {
    $storeData = '{"name":"API Test Store","url":"https://example.com","platform":"SHOPIFY"}'
    $store = Invoke-RestMethod -Uri "$baseUrl/stores" -Method POST -Body $storeData -ContentType "application/json" -Headers $headers
    $storeId = $store.id
    $results += @{ Test = "Stores - Create"; Status = "✅ PASS"; Details = "Store ID: $storeId" }
    Write-Host "  ✅ Store created: $storeId" -ForegroundColor Green
} catch {
    $results += @{ Test = "Stores - Create"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $storeId = "cmjhhmymb0007y923cj75b3el" # Use existing store
}

# Test 4: Stores - Get by ID
Write-Host "[4/10] Testing Stores - Get by ID..." -ForegroundColor Yellow
try {
    $storeDetail = Invoke-RestMethod -Uri "$baseUrl/stores/$storeId" -Method GET -Headers $headers
    $results += @{ Test = "Stores - Get by ID"; Status = "✅ PASS"; Details = "Store: $($storeDetail.name)" }
    Write-Host "  ✅ Store retrieved: $($storeDetail.name)" -ForegroundColor Green
} catch {
    $results += @{ Test = "Stores - Get by ID"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Crawler - Start Crawl
Write-Host "[5/10] Testing Crawler - Start Crawl..." -ForegroundColor Yellow
try {
    $crawl = Invoke-RestMethod -Uri "$baseUrl/crawler/stores/$storeId/crawl" -Method POST -Headers $headers
    $results += @{ Test = "Crawler - Start"; Status = "✅ PASS"; Details = "Crawl ID: $($crawl.id)" }
    Write-Host "  ✅ Crawl started: $($crawl.id)" -ForegroundColor Green
} catch {
    $results += @{ Test = "Crawler - Start"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Analytics - Dashboard
Write-Host "[6/10] Testing Analytics - Dashboard..." -ForegroundColor Yellow
try {
    $dashboard = Invoke-RestMethod -Uri "$baseUrl/analytics/stores/$storeId/dashboard" -Method GET -Headers $headers
    $results += @{ Test = "Analytics - Dashboard"; Status = "✅ PASS"; Details = "Profit Score: $($dashboard.profitScore)" }
    Write-Host "  ✅ Dashboard retrieved" -ForegroundColor Green
} catch {
    $results += @{ Test = "Analytics - Dashboard"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Analytics - Insights
Write-Host "[7/10] Testing Analytics - Insights..." -ForegroundColor Yellow
try {
    $insights = Invoke-RestMethod -Uri "$baseUrl/analytics/stores/$storeId/insights" -Method GET -Headers $headers
    $results += @{ Test = "Analytics - Insights"; Status = "✅ PASS"; Details = "Found $($insights.Count) insights" }
    Write-Host "  ✅ Insights retrieved: $($insights.Count) found" -ForegroundColor Green
} catch {
    $results += @{ Test = "Analytics - Insights"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: DFY - List Projects
Write-Host "[8/10] Testing DFY - List Projects..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$baseUrl/dfy/projects" -Method GET -Headers $headers
    $results += @{ Test = "DFY - List"; Status = "✅ PASS"; Details = "Found $($projects.Count) projects" }
    Write-Host "  ✅ Projects listed: $($projects.Count) found" -ForegroundColor Green
} catch {
    $results += @{ Test = "DFY - List"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: DFY - Create Project
Write-Host "[9/10] Testing DFY - Create Project..." -ForegroundColor Yellow
try {
    $dfyData = '{"projectName":"API Test Project","niche":"Technology"}'
    $project = Invoke-RestMethod -Uri "$baseUrl/dfy/projects" -Method POST -Body $dfyData -ContentType "application/json" -Headers $headers
    $projectId = $project.id
    $results += @{ Test = "DFY - Create"; Status = "✅ PASS"; Details = "Project ID: $projectId" }
    Write-Host "  ✅ Project created: $projectId" -ForegroundColor Green
} catch {
    $results += @{ Test = "DFY - Create"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: DFY - Get Project
if ($projectId) {
    Write-Host "[10/10] Testing DFY - Get Project..." -ForegroundColor Yellow
    try {
        $projectDetail = Invoke-RestMethod -Uri "$baseUrl/dfy/projects/$projectId" -Method GET -Headers $headers
        $results += @{ Test = "DFY - Get"; Status = "✅ PASS"; Details = "Status: $($projectDetail.status)" }
        Write-Host "  ✅ Project retrieved: $($projectDetail.projectName)" -ForegroundColor Green
    } catch {
        $results += @{ Test = "DFY - Get"; Status = "❌ FAIL"; Details = $_.Exception.Message }
        Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n=== TEST SUMMARY ===" -ForegroundColor Cyan
$passed = ($results | Where-Object { $_.Status -like "*✅*" }).Count
$failed = ($results | Where-Object { $_.Status -like "*❌*" }).Count
Write-Host "Total Tests: $($results.Count)" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

Write-Host "`n=== DETAILED RESULTS ===" -ForegroundColor Cyan
$results | ForEach-Object {
    Write-Host "$($_.Status) $($_.Test): $($_.Details)"
}

if ($failed -eq 0) {
    Write-Host "`n✅ ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ SOME TESTS FAILED!" -ForegroundColor Red
    exit 1
}
