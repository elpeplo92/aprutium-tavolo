@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Aprutium Tavolo: pubblicazione su GitHub ===
where git >nul 2>nul || (echo Git non trovato: installalo da gitforwindows.org e riprova. & pause & exit /b 1)
set NEWEST=
for /f "delims=" %%f in ('dir /b /o-d "..\_tavolo_tmp\aprutium-tavolo-site*.tgz" 2^>nul') do (
  if not defined NEWEST set "NEWEST=%%f"
)
if defined NEWEST (
  echo Scompatto: %NEWEST%
  tar -xzf "..\_tavolo_tmp\%NEWEST%"
)
if not exist "index.html" (echo Manca index.html: il pacchetto non e' stato trovato. & pause & exit /b 1)
findstr /c:"Versione della pagina" index.html | findstr /o "v4" >nul
for /f "tokens=2 delims=>" %%v in ('findstr /c:"Versione della pagina" index.html') do echo Versione trovata: %%v
if not exist ".git" (
  git init -b main
  git remote add origin https://github.com/elpeplo92/aprutium-tavolo.git
)
git config user.name "Giuseppe" >nul
git config user.email "arangiarog@gmail.com" >nul
git add -A
git commit -m "Aggiornamento tavolo %date% %time%" >nul 2>nul
git push -u origin main --force
if errorlevel 1 (echo. & echo Qualcosa non ha funzionato: manda a Claude una foto di questa finestra. & pause & exit /b 1)
echo.
echo Fatto. Il tavolo e' online tra un minuto: https://elpeplo92.github.io/aprutium-tavolo/
pause
