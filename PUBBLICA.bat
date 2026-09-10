@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Aprutium Tavolo: pubblicazione su GitHub ===
where git >nul 2>nul || (echo Git non trovato: installalo da gitforwindows.org e riprova. & pause & exit /b 1)
if exist "..\_tavolo_tmp\aprutium-tavolo-site.tgz" (
  echo Scompatto l'ultima versione del tavolo...
  tar -xzf "..\_tavolo_tmp\aprutium-tavolo-site.tgz"
)
if not exist "index.html" (echo Manca index.html: il pacchetto non e' stato trovato. & pause & exit /b 1)
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
timeout /t 10 >nul
