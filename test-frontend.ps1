# Frontend Page Testing Script
Write-Host "`n=== WATKINS AI - FRONTEND PAGE TESTING ===" -ForegroundColor Cyan
Write-Host "Testing all frontend pages`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$results = @()

# Test pages
$pages = @(
    @{ Path = "/"; Name = "Home" },
    @{ Path = "/auth/login"; Name = "Login Page" },
    @{ Path = "/auth/register"; Name = "Register Page" },
    @{ Path = "/dashboard"; Name = "Dashboard" },
    @{ Path = "/dashboard/stores"; Name = "Stores Page" },
    @{ Path = "/dashboard/analytics"; Name = "Analytics Page" },
    @{ Path = "/dashboard/dfy"; Name = "DFY Builder Page" }
)

$testNum = 1
$totalTests = $pages.Count

foreach ($page in $pages) {
    Write-Host "[$testNum/$totalTests] Testing $($page.Name) ($($page.Path))..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($page.Path)" -Method GET -UseBasicParsing -TimeoutSec 10
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            $results += @{ Test = $page.Name; Status = "✅ PASS"; Details = "Status $statusCode" }
            Write-Host "  ✅ Page loads successfully (200)" -ForegroundColor Green
        } elseif ($statusCode -eq 307 -or $statusCode -eq 302) {
            $results += @{ Test = $page.Name; Status = "✅ PASS"; Details = "Redirect $statusCode (expected)" }
            Write-Host "  ✅ Page redirects (expected for protected routes)" -ForegroundColor Green
        } else {
            $results += @{ Test = $page.Name; Status = "⚠️  WARN"; Details = "Status $statusCode" }
            Write-Host "  ⚠️  Unexpected status: $statusCode" -ForegroundColor Yellow
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 404) {
            $results += @{ Test = $page.Name; Status = "❌ FAIL"; Details = "404 Not Found" }
            Write-Host "  ❌ Page not found (404)" -ForegroundColor Red
        } elseif ($statusCode -eq 307 -or $statusCode -eq 302) {
            $results += @{ Test = $page.Name; Status = "✅ PASS"; Details = "Redirect (auth required)" }
            Write-Host "  ✅ Page redirects for auth (expected)" -ForegroundColor Green
        } else {
            $results += @{ Test = $page.Name; Status = "❌ FAIL"; Details = $_.Exception.Message }
            Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    $testNum++
}

# Summary
Write-Host "`n=== TEST SUMMARY ===" -ForegroundColor Cyan
$passed = ($results | Where-Object { $_.Status -like "*✅*" }).Count
$warnings = ($results | Where-Object { $_.Status -like "*⚠️*" }).Count
$failed = ($results | Where-Object { $_.Status -like "*❌*" }).Count

Write-Host "Total Tests: $($results.Count)" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Warnings: $warnings" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red

Write-Host "`n=== DETAILED RESULTS ===" -ForegroundColor Cyan
$results | ForEach-Object {
    Write-Host "$($_.Status) $($_.Test): $($_.Details)"
}

if ($failed -eq 0) {
    Write-Host "`n✅ ALL FRONTEND PAGES WORKING!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ SOME PAGES FAILED!" -ForegroundColor Red
    exit 1
}
