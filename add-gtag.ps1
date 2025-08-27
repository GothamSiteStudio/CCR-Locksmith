# PowerShell script to add Google Analytics tag to all HTML files
$gtagCode = @"

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-G1CZ4BTQTH"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-G1CZ4BTQTH');
    </script>
"@

# Get all HTML files in the current directory
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if gtag is already present
    if ($content -match "googletagmanager.com/gtag") {
        Write-Host "Skipping $($file.Name) - Google tag already present"
        continue
    }
    
    # Add the gtag code after <head> tag
    if ($content -match "(<head[^>]*>)") {
        $newContent = $content -replace "(<head[^>]*>)", "`$1$gtagCode"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Added Google tag to $($file.Name)"
    } else {
        Write-Host "Warning: Could not find <head> tag in $($file.Name)"
    }
}

Write-Host "Completed adding Google Analytics tags to HTML files"
