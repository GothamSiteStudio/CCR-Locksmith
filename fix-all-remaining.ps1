# Fix all remaining HTML files - flexible matching
$allFiles = Get-ChildItem -Path $PSScriptRoot -Filter "*.html"
$updated = 0
$skipped = 0
$alreadyFixed = 0

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Skip if already has preload
    if ($content -match 'preload.*fontawesome') {
        $alreadyFixed++
        continue
    }
    
    # Pattern 1: Match the main.css loading section flexibly
    $pattern = '(\s*)<!-- Critical CSS loaded normally -->\s*\n\s*<link rel="stylesheet" href="assets/css/main\.css" />'
    
    if ($content -match $pattern) {
        $indent = $Matches[1]
        
        # Build the replacement with correct indentation
        $preloadSection = @"
$indent<!-- Preload critical fonts -->
$indent<link rel="preload" as="style" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap">
$indent<link rel="preload" as="style" href="assets/css/fontawesome-all.min.css">

$indent<!-- Critical CSS loaded normally -->
$indent<link rel="stylesheet" href="assets/css/main.css" />
"@
        
        $content = $content -replace $pattern, $preloadSection
        
        # Add deferred loading after "Non-critical CSS deferred" comment
        $pattern2 = '(<!-- Non-critical CSS deferred -->\s*\n)'
        $replacement2 = "`$1$indent<link rel=`"stylesheet`" href=`"https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap`" media=`"print`" onload=`"this.media='all'`">`n$indent<link rel=`"stylesheet`" href=`"assets/css/fontawesome-all.min.css`" media=`"print`" onload=`"this.media='all'`">`n"
        $content = $content -replace $pattern2, $replacement2
        
        # Add to noscript section
        $pattern3 = '(<noscript>\s*\n)(\s*)(<link rel="stylesheet")'
        $replacement3 = "`$1`$2<link rel=`"stylesheet`" href=`"https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap`" />`n`$2<link rel=`"stylesheet`" href=`"assets/css/fontawesome-all.min.css`" />`n`$2`$3"
        $content = $content -replace $pattern3, $replacement3
        
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updated++
    } else {
        Write-Host "Skipped: $($file.Name)" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Total files: $($allFiles.Count)" -ForegroundColor White
Write-Host "Already fixed: $alreadyFixed" -ForegroundColor Blue
Write-Host "Updated: $updated" -ForegroundColor Green
Write-Host "Skipped: $skipped" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
