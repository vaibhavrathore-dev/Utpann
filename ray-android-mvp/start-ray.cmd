@echo off

echo ========================================
echo       STARTING RAY MOBILE APP
echo ========================================

set "REACT_NATIVE_PACKAGER_HOSTNAME=192.168.14.173"

echo.
echo RAY Development Server:
echo http://%REACT_NATIVE_PACKAGER_HOSTNAME%:8081
echo.

call npx expo start --dev-client --clear --lan --port 8081

pause