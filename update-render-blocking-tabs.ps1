# Update remaining HTML files with tabs
$files = Get-ChildItem -Path $PSScriptRoot -Filter "*.html" | 
    Where-Object { $_.Name -notin @("index.html", "magnetic-lock-installation.html", "about.html", "blog.html", 
    "automotive.html", "broken-key-extraction.html", "car-lockout-service.html", "commercial.html", 
    "contact.html", "deadbolt-installation.html", "emergency.html", "house-lockout.html", "residential.html",
    "access-control-system-installation.html") }

$oldText = @'
		<!-- Critical CSS loaded normally -->
		<link rel="stylesheet" href="assets/css/main.css" />

		<!-- Non-critical CSS deferred -->
		<link rel="stylesheet" href="assets/css/accessibility-improvements.css" media="print" onload="this.media='all'">

		<!-- Fallback for browsers without JS -->
		<noscript>
		  <link rel="stylesheet" href="assets/css/accessibility-improvements.css" />
		</noscript>
'@

$newText = @'
		<!-- Preload critical fonts -->
		<link rel="preload" as="style" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap">
		<link rel="preload" as="style" href="assets/css/fontawesome-all.min.css">

		<!-- Critical CSS loaded normally -->
		<link rel="stylesheet" href="assets/css/main.css" />

		<!-- Non-critical CSS deferred -->
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap" media="print" onload="this.media='all'">
		<link rel="stylesheet" href="assets/css/fontawesome-all.min.css" media="print" onload="this.media='all'">
		<link rel="stylesheet" href="assets/css/accessibility-improvements.css" media="print" onload="this.media='all'">

		<!-- Fallback for browsers without JS -->
		<noscript>
		  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic,600&display=swap" />
		  <link rel="stylesheet" href="assets/css/fontawesome-all.min.css" />
		  <link rel="stylesheet" href="assets/css/accessibility-improvements.css" />
		</noscript>
'@

$updated = 0
$skipped = 0

Write-Host "Processing $($files.Count) files with tabs..." -ForegroundColor Cyan

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldText)) {
        $newContent = $content -replace [regex]::Escape($oldText), $newText
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updated++
    } else {
        $skipped++
    }
}

Write-Host "`nTotal: $($files.Count) | Updated: $updated | Skipped: $skipped" -ForegroundColor Cyan
