# Pubblica il sito su Cloudflare (Worker "aprutium-tavolo", asset statici).
# Uso, dalla cartella Sito:  powershell -ExecutionPolicy Bypass -File strumenti\pubblica-cloudflare.ps1
# Prima si fa `py build.py` e si prova con `node strumenti/prova-tavolo.js`.
# Carica solo cio' che serve alla pagina: index.html, img, font, dice.
# Restano fuori _privato, src, contenuti, comp, strumenti e i file di lavoro.
# Serve il login di wrangler gia' fatto (npx wrangler login, una volta sola).

$ErrorActionPreference = 'Stop'
$sito = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $env:TEMP 'aprutium-cloudflare'
$nome = 'aprutium-tavolo'

if (-not (Test-Path (Join-Path $sito 'index.html'))) { throw "index.html non trovato in $sito" }

New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item (Join-Path $sito 'index.html') $dest -Force
foreach ($d in 'img', 'font', 'dice') {
    # /MIR: la copia in $dest diventa uguale alla cartella del sito (toglie anche i file spariti)
    robocopy (Join-Path $sito $d) (Join-Path $dest $d) /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy ha fallito su $d (codice $LASTEXITCODE)" }
}

$file = Get-ChildItem $dest -Recurse -File
$mb = [math]::Round(($file | Measure-Object Length -Sum).Sum / 1MB)
$grandi = $file | Where-Object { $_.Length -gt 25MB }
if ($grandi) { throw "File sopra i 25 MB (Cloudflare li rifiuta): $($grandi.FullName -join ', ')" }
if ($file.Count -gt 20000) { throw "Piu' di 20.000 file ($($file.Count))" }
"Cartella pronta: $($file.Count) file, $mb MB"

Push-Location $dest
try {
    npx.cmd -y wrangler deploy --assets . --name $nome --compatibility-date 2026-11-01
    if ($LASTEXITCODE -ne 0) { throw "wrangler deploy ha fallito (codice $LASTEXITCODE)" }
}
finally { Pop-Location }

"Online: https://$nome.aprutium.workers.dev"
