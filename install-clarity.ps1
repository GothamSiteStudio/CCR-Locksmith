# Install Microsoft Clarity on all HTML files

$clarityCode = @'
    
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "v3l3frl9lq");
    </script>
'@

$rootPath = Get-Location

$htmlFiles = Get-ChildItem -Path $rootPath -Filter "*.html" -File | Where-Object { $_.DirectoryName -eq $rootPath.Path }

$count = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Check if Clarity is already installed
    if ($content -match "clarity\.ms/tag") {
        Write-Host "Skipping $($file.Name) - Clarity already installed"
        continue
    }
    
    # Add Clarity code after Google Analytics
    if ($content -match "gtag\('config', 'G-G1CZ4BTQTH'\);") {
        $content = $content -replace "(gtag\('config', 'G-G1CZ4BTQTH'\);)", "`$1$clarityCode"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Installed in $($file.Name)"
        $count++
    }
    else {
        Write-Host "Skipping $($file.Name) - Could not find gtag config"
    }
}

Write-Host "`nMicrosoft Clarity installed in $count files"
