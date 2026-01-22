@echo off
REM MongoDB Installation Script for Windows
REM Run as Administrator

echo.
echo ============================================
echo MongoDB Installation for Windows
echo ============================================
echo.

REM Create data directory
if not exist C:\data\db mkdir C:\data\db
echo Created data directory: C:\data\db

REM Download MongoDB
echo.
echo Downloading MongoDB 7.0.5...
echo.
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi', '%TEMP%\mongodb-7.0.5.msi')"

if exist "%TEMP%\mongodb-7.0.5.msi" (
    echo.
    echo Installing MongoDB...
    msiexec.exe /i "%TEMP%\mongodb-7.0.5.msi" /quiet /norestart
    echo.
    echo MongoDB installation complete!
    echo.
    echo Starting MongoDB service...
    net start MongoDB
    echo.
    echo ============================================
    echo MongoDB is running on localhost:27017
    echo ============================================
) else (
    echo.
    echo ERROR: Download failed!
    echo Please download manually from:
    echo https://www.mongodb.com/try/download/community
    echo.
)

pause
