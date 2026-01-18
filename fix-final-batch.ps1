# Final fix for all remaining HTML files
$allFiles = Get-ChildItem -Path $PSScriptRoot -Filter "*.html"
$updated = 0
$alreadyFixed = 0

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Skip if already has preload
    if ($content -match 'preload.*fontawesome') {
        $alreadyFixed++
        continue
    }
    
    # Pattern for files without comments (direct CSS links)
    $pattern = '(\s*)<link rel="stylesheet" href="assets/css/main\.css" />\s*\n\s*<link rel="stylesheet" href="assets/css/accessibility-improvements\.css" />'
    
    if ($content -match $pattern) {
        $indent = $Matches[1]
        
        $replacement = @"
$indent<!-- Preconnect to Google Fonts for faster loading -->
$indent<link rel="preconnect" href="https://fonts.googleapis.com">
$indent<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

$indent<!-- Preload critical fonts -->
$indent<link rel="preload" as="style" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap">
$indent<link rel="preload" as="style" href="assets/css/fontawesome-all.min.css">

$indent<link rel="stylesheet" href="assets/css/main.css" />
$indent<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap" media="print" onload="this.media='all'">
$indent<link rel="stylesheet" href="assets/css/fontawesome-all.min.css" media="print" onload="this.media='all'">
$indent<link rel="stylesheet" href="assets/css/accessibility-improvements.css" media="print" onload="this.media='all'">

$indent<!-- Fallback for browsers without JS -->
$indent<noscript>
$indent  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap" />
$indent  <link rel="stylesheet" href="assets/css/fontawesome-all.min.css" />
$indent  <link rel="stylesheet" href="assets/css/accessibility-improvements.css" />
$indent</noscript>
"@
        
        $content = $content -replace $pattern, $replacement
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updated++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Already fixed: $alreadyFixed" -ForegroundColor Blue
Write-Host "Updated now: $updated" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
