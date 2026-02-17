$baseUrl = "http://localhost:50000"
$email = "testuser$(Get-Random)@company.com"
$password = "TestPassword123"

Write-Host "BACKEND API TEST" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Yellow
$health = Invoke-WebRequest -Uri "$baseUrl/api/health" -UseBasicParsing
Write-Host "Status: $($health.StatusCode)" -ForegroundColor Green

# Test 2: Register
Write-Host "[TEST 2] Register User" -ForegroundColor Yellow
$registerBody = @{
  name = "John Doe"
  email = $email
  password = $password
  department = "Engineering"
  role = "Employee"
} | ConvertTo-Json

try {
  $registerResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $registerBody -UseBasicParsing
  
  $regData = $registerResp.Content | ConvertFrom-Json
  Write-Host "Status: $($registerResp.StatusCode)" -ForegroundColor Green
  Write-Host "Message: $($regData.message)" 
  Write-Host "Employee ID: $($regData.data.user.employeeId)" 
  $token = $regData.data.token
  
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  Write-Host "ERROR Status: $statusCode" -ForegroundColor Red
  $content = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
  Write-Host "Response: $content" -ForegroundColor Red
}

# Test 3: Login
Write-Host "[TEST 3] Login" -ForegroundColor Yellow
$loginBody = @{
  email = $email
  password = $password
} | ConvertTo-Json

try {
  $loginResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $loginBody -UseBasicParsing
  
  $loginData = $loginResp.Content | ConvertFrom-Json
  Write-Host "Status: $($loginResp.StatusCode)" -ForegroundColor Green
  Write-Host "Message: $($loginData.message)"
  
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  Write-Host "ERROR Status: $statusCode" -ForegroundColor Red
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Tests completed" -ForegroundColor Green
