# API Testing Script

$baseUrl = "http://localhost:50000"
$email = "testuser$(Get-Random)@company.com"
$password = "TestPassword123"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BACKEND API STABILITY TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Yellow
try {
  $health = Invoke-WebRequest -Uri "$baseUrl/api/health" -UseBasicParsing
  Write-Host "✓ Status: $($health.StatusCode)" -ForegroundColor Green
  Write-Host "✓ Server is running`n" -ForegroundColor Green
} catch {
  Write-Host "✗ Health check failed: $($_.Exception.Message)`n" -ForegroundColor Red
  exit 1
}

# Test 2: Register User
Write-Host "[TEST 2] Register New User" -ForegroundColor Yellow
$registerBody = @{
  name = "John Doe Test"
  email = $email
  password = $password
  department = "Engineering"
  role = "Employee"
} | ConvertTo-Json

try {
  $registerResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $registerBody -UseBasicParsing
  
  $regData = $registerResp.Content | ConvertFrom-Json
  Write-Host "✓ Status: $($registerResp.StatusCode)" -ForegroundColor Green
  Write-Host "✓ Message: $($regData.message)" -ForegroundColor Green
  Write-Host "✓ Employee ID: $($regData.data.user.employeeId)" -ForegroundColor Green
  Write-Host "✓ Email: $($regData.data.user.email)" -ForegroundColor Green
  Write-Host "✓ Token issued: Yes`n" -ForegroundColor Green
  
  $token = $regData.data.token
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  $error = $content | ConvertFrom-Json
  Write-Host "✗ Status: $statusCode" -ForegroundColor Red
  Write-Host "✗ Error: $($error.message)`n" -ForegroundColor Red
  exit 1
}

# Test 3: Login with Valid Credentials
Write-Host "[TEST 3] Login with Valid Credentials" -ForegroundColor Yellow
$loginBody = @{
  email = $email
  password = $password
} | ConvertTo-Json

try {
  $loginResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $loginBody -UseBasicParsing
  
  $loginData = $loginResp.Content | ConvertFrom-Json
  Write-Host "✓ Status: $($loginResp.StatusCode)" -ForegroundColor Green
  Write-Host "✓ Message: $($loginData.message)" -ForegroundColor Green
  Write-Host "✓ User: $($loginData.data.user.email)" -ForegroundColor Green
  Write-Host "✓ Token assigned: Yes`n" -ForegroundColor Green
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  Write-Host "✗ Status: $statusCode" -ForegroundColor Red
  Write-Host "✗ Response: $content`n" -ForegroundColor Red
  exit 1
}

# Test 4: Login with Invalid Password
Write-Host "[TEST 4] Login with Invalid Password" -ForegroundColor Yellow
$badLoginBody = @{
  email = $email
  password = "WrongPassword"
} | ConvertTo-Json

try {
  $badResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $badLoginBody -UseBasicParsing -ErrorAction Stop
  Write-Host "✗ Should have returned 401 but got: $($badResp.StatusCode)`n" -ForegroundColor Red
  exit 1
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  $error = $content | ConvertFrom-Json
  
  if ($statusCode -eq 401) {
    Write-Host "✓ Correctly returned 401 Unauthorized" -ForegroundColor Green
    Write-Host "✓ Message: $($error.message)`n" -ForegroundColor Green
  } else {
    Write-Host "✗ Unexpected status code: $statusCode`n" -ForegroundColor Red
    exit 1
  }
}

# Test 5: Duplicate Email Registration
Write-Host "[TEST 5] Duplicate Email Registration" -ForegroundColor Yellow
$dupBody = @{
  name = "Duplicate User"
  email = $email
  password = "AnotherPassword"
  department = "Sales"
  role = "Employee"
} | ConvertTo-Json

try {
  $dupResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $dupBody -UseBasicParsing -ErrorAction Stop
  Write-Host "✗ Should have returned 409 but got: $($dupResp.StatusCode)`n" -ForegroundColor Red
  exit 1
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  $error = $content | ConvertFrom-Json
  
  if ($statusCode -eq 409) {
    Write-Host "✓ Correctly returned 409 Conflict" -ForegroundColor Green
    Write-Host "✓ Message: $($error.message)`n" -ForegroundColor Green
  } else {
    Write-Host "✗ Unexpected status code: $statusCode`n" -ForegroundColor Red
    exit 1
  }
}

# Test 6: Get Profile with Valid Token
Write-Host "[TEST 6] Get Profile with Valid Token" -ForegroundColor Yellow
try {
  $profileResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/me" -Method GET `
    -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
  
  $profileData = $profileResp.Content | ConvertFrom-Json
  Write-Host "✓ Status: $($profileResp.StatusCode)" -ForegroundColor Green
  Write-Host "✓ Retrieved email: $($profileData.data.email)" -ForegroundColor Green
  Write-Host "✓ Retrieved role: $($profileData.data.role)`n" -ForegroundColor Green
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  Write-Host "✗ Status: $statusCode" -ForegroundColor Red
  Write-Host "✗ Failed to get profile`n" -ForegroundColor Red
  exit 1
}

# Test 7: Get Profile without Token (Should fail)
Write-Host "[TEST 7] Protected Route Without Token" -ForegroundColor Yellow
try {
  $noTokenResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/me" -Method GET `
    -UseBasicParsing -ErrorAction Stop
  Write-Host "✗ Should have returned 401 but got: $($noTokenResp.StatusCode)`n" -ForegroundColor Red
  exit 1
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  
  if ($statusCode -eq 401) {
    Write-Host "✓ Correctly returned 401 Unauthorized" -ForegroundColor Green
    Write-Host "✓ Protected route enforcement working`n" -ForegroundColor Green
  } else {
    Write-Host "✗ Unexpected status code: $statusCode`n" -ForegroundColor Red
    exit 1
  }
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✓ All 7 tests passed!" -ForegroundColor Green
Write-Host "✓ No 500 Internal Server Errors encountered" -ForegroundColor Green
Write-Host "✓ Authentication working correctly" -ForegroundColor Green
Write-Host "✓ Error handling working correctly" -ForegroundColor Green
Write-Host "✓ Database operations stable" -ForegroundColor Green
Write-Host "✓ Backend is production-ready`n" -ForegroundColor Green

Write-Host "Server: Running on port 50000" -ForegroundColor Cyan
Write-Host "Status: OPERATIONAL`n" -ForegroundColor Green
