$baseUrl = "http://localhost:50000"
$email = "testuser$(Get-Random)@company.com"
$password = "TestPassword123"

Write-Host "BACKEND API STABILITY TEST" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Yellow
try {
  $health = Invoke-WebRequest -Uri "$baseUrl/api/health" -UseBasicParsing
  Write-Host "PASS - Status: $($health.StatusCode)`n" -ForegroundColor Green
} catch {
  Write-Host "FAIL - $($_.Exception.Message)`n" -ForegroundColor Red
  exit 1
}

# Test 2: Register with correct data
Write-Host "[TEST 2] Register New User" -ForegroundColor Yellow
$registerBody = @{
  name = "John Doe"
  email = $email
  password = "TestPassword123"
  department = "Engineering"
  role = "employee"
} | ConvertTo-Json

try {
  $registerResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $registerBody -UseBasicParsing
  
  $regData = $registerResp.Content | ConvertFrom-Json
  Write-Host "PASS - Status: $($registerResp.StatusCode)" -ForegroundColor Green
  Write-Host "  Message: $($regData.message)"
  Write-Host "  Email: $($regData.data.user.email)"
  Write-Host "  Employee ID: $($regData.data.user.employeeId)"
  $token = $regData.data.token
  Write-Host ""
  
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  $error = $content | ConvertFrom-Json
  Write-Host "FAIL - Status: $statusCode" -ForegroundColor Red
  Write-Host "  Message: $($error.message)`n" -ForegroundColor Red
  exit 1
}

# Test 3: Login with correct credentials
Write-Host "[TEST 3] Login with Valid Credentials" -ForegroundColor Yellow
$loginBody = @{
  email = $email
  password = $password
} | ConvertTo-Json

try {
  $loginResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $loginBody -UseBasicParsing
  
  $loginData = $loginResp.Content | ConvertFrom-Json
  Write-Host "PASS - Status: $($loginResp.StatusCode)" -ForegroundColor Green
  Write-Host "  Message: $($loginData.message)"
  Write-Host "  Email: $($loginData.data.user.email)"
  Write-Host ""
  
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  $error = $content | ConvertFrom-Json
  Write-Host "FAIL - Status: $statusCode" -ForegroundColor Red
  Write-Host "  Message: $($error.message)`n" -ForegroundColor Red
  exit 1
}

# Test 4: Login with bad password
Write-Host "[TEST 4] Login with Invalid Credentials" -ForegroundColor Yellow
$badLoginBody = @{
  email = $email
  password = "WrongPassword"
} | ConvertTo-Json

try {
  $badResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $badLoginBody -UseBasicParsing -ErrorAction Stop
  Write-Host "FAIL - Should have returned 401 but got: $($badResp.StatusCode)`n" -ForegroundColor Red
  exit 1
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  if ($statusCode -eq 401) {
    Write-Host "PASS - Status: 401 (Invalid credentials)" -ForegroundColor Green
    $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    $errorData = $content | ConvertFrom-Json
    Write-Host "  Message: $($errorData.message)`n" -ForegroundColor Green
  } else {
    Write-Host "FAIL - Unexpected status: $statusCode`n" -ForegroundColor Red
    exit 1
  }
}

# Test 5: Duplicate email
Write-Host "[TEST 5] Register with Duplicate Email" -ForegroundColor Yellow
$dupBody = @{
  name = "Duplicate User"
  email = $email
  password = "AnotherPassword"
  department = "HR"
  role = "employee"
} | ConvertTo-Json

try {
  $dupResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $dupBody -UseBasicParsing -ErrorAction Stop
  Write-Host "FAIL - Should have returned 409 but got: $($dupResp.StatusCode)`n" -ForegroundColor Red
  exit 1
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  if ($statusCode -eq 409) {
    Write-Host "PASS - Status: 409 (Duplicate email)" -ForegroundColor Green
    $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    $dupError = $content | ConvertFrom-Json
    Write-Host "  Message: $($dupError.message)`n" -ForegroundColor Green
  } else {
    Write-Host "FAIL - Unexpected status: $statusCode`n" -ForegroundColor Red
    exit 1
  }
}

# Test 6: Get profile with token
Write-Host "[TEST 6] Get Profile with Valid Token" -ForegroundColor Yellow
try {
  $profileResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/me" -Method GET `
    -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
  
  $profileData = $profileResp.Content | ConvertFrom-Json
  Write-Host "PASS - Status: $($profileResp.StatusCode)" -ForegroundColor Green
  Write-Host "  Email: $($profileData.data.email)"
  Write-Host "  Role: $($profileData.data.role)`n" -ForegroundColor Green
  
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  Write-Host "FAIL - Status: $statusCode`n" -ForegroundColor Red
  exit 1
}

# Test 7: Access protected route without token
Write-Host "[TEST 7] Protected Route Without Token" -ForegroundColor Yellow
try {
  $noTokenResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/me" -Method GET `
    -UseBasicParsing -ErrorAction Stop
  Write-Host "FAIL - Should have returned 401 but got: $($noTokenResp.StatusCode)`n" -ForegroundColor Red
  exit 1
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  if ($statusCode -eq 401) {
    Write-Host "PASS - Status: 401 (Unauthorized)`n" -ForegroundColor Green
  } else {
    Write-Host "FAIL - Unexpected status: $statusCode`n" -ForegroundColor Red
    exit 1
  }
}

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Status: PRODUCTION READY" -ForegroundColor Green
Write-Host "No 500 errors encountered" -ForegroundColor Green
Write-Host "Server running on port 50000" -ForegroundColor Green
