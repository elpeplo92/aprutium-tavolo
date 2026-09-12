@echo off
setlocal
rem Scarica le 107 immagini degli handout dei Luoghi generate su Higgsfield.
rem Le mette in 7_Aprutium\05_Immagini\Handout Luoghi\ (una per voce, nome = id della voce).
rem Se un file c'e' gia' lo salta: si puo' rilanciare senza problemi.
set "DEST=%~dp0..\05_Immagini\Handout Luoghi"
if not exist "%DEST%" mkdir "%DEST%"
echo Scarico in: %DEST%
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$dest='%DEST%'; $lines=Get-Content -Encoding UTF8 '%~dp0immagini-luoghi.txt'; $n=0; $err=0; foreach($l in $lines){ if(-not $l.Trim()){continue}; $p=$l -split '\|'; $out=Join-Path $dest ($p[0]+'.png'); if(Test-Path $out){ Write-Host ('gia presente: '+$p[0]); continue }; try { Invoke-WebRequest -Uri $p[1] -OutFile $out -UseBasicParsing; $n++; Write-Host ('scaricata: '+$p[0]+'  ('+$p[2]+')') } catch { $err++; Write-Host ('ERRORE: '+$p[0]+' -> '+$_.Exception.Message) } }; Write-Host ''; Write-Host ('Fatto: '+$n+' immagini nuove, '+$err+' errori.')"
echo.
echo Ora puoi dirlo a Claude: le importa nel sito al posto dei link esterni.
pause
