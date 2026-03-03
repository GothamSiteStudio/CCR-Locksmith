# E-E-A-T Enhancement Script for CCR Locksmith
# This script updates all HTML files to improve E-E-A-T signals

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ============================================================
# 1. ADD ORGANIZATION SCHEMA TO PAGES THAT DON'T HAVE ONE
# ============================================================

$orgSchema = @'
    <!-- Organization Schema (E-E-A-T) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Locksmith", "LocalBusiness"],
      "@id": "https://www.carcommercialresidentialemergencylocksmithservice.com/#organization",
      "name": "Car Commercial Residential Emergency Locksmith Service, LLC",
      "alternateName": "CCR Locksmith",
      "url": "https://www.carcommercialresidentialemergencylocksmithservice.com/",
      "logo": "https://www.carcommercialresidentialemergencylocksmithservice.com/images/Logo.png",
      "image": "https://www.carcommercialresidentialemergencylocksmithservice.com/images/Logo.png",
      "telephone": "+13138893266",
      "email": "carcommercialresidentiallocks@gmail.com",
      "description": "Licensed and insured 24/7 emergency locksmith serving Metro Detroit since 2015. Specializing in automotive, residential, and commercial locksmith services with a 5-year warranty on all parts and labor.",
      "foundingDate": "2015",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Southfield",
        "addressRegion": "MI",
        "postalCode": "48076",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 42.4734,
        "longitude": -83.2219
      },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday"], "opens": "06:30", "closes": "23:30" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "06:30", "closes": "13:00" }
      ],
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61579724369488",
        "https://www.instagram.com/ccrels.mi/"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "150",
        "reviewCount": "150"
      }
    }
    </script>
'@

# Skip files that already have enhanced schema (index.html and about.html)
$skipFiles = @("index.html", "about.html", "formspree-alternative.html", "left-sidebar.html", "no-sidebar.html", "right-sidebar.html", "thank-you.html")

$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -File | Where-Object { $_.Name -notin $skipFiles }

$schemaAdded = 0
$schemaSkipped = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Check if file already has an @id organization reference
    if ($content -match '#organization') {
        $schemaSkipped++
        continue
    }
    
    # Add schema before </head>
    if ($content -match '</head>') {
        $newContent = $content -replace '</head>', "$orgSchema`n  </head>"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $schemaAdded++
        Write-Host "  [SCHEMA] Added to: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nSchema: Added to $schemaAdded files, skipped $schemaSkipped (already had it)" -ForegroundColor Cyan

# ============================================================
# 2. ENHANCE TRUST BAR WITH MORE E-E-A-T SIGNALS
# ============================================================

# Old trust bar patterns (we need to handle variations)
$oldTrustBarPatterns = @(
    # Pattern with role attributes (index.html style)
    '<div class="trust-items" role="list">
        <div class="trust-item" role="listitem">
          <i class="fas fa-shield-alt" aria-hidden="true"></i>
          <span>Licensed & Insured</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-award" aria-hidden="true"></i>
          <span>5-Year Warranty</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-clock" aria-hidden="true"></i>
          <span>24/7 Response</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-star" aria-hidden="true"></i>
          <span>Local Experts</span>
        </div>
      </div>'
)

$newTrustBarWithRoles = @'
<div class="trust-items" role="list">
        <div class="trust-item" role="listitem">
          <i class="fas fa-shield-alt" aria-hidden="true"></i>
          <span>Licensed & Insured</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-award" aria-hidden="true"></i>
          <span>5-Year Warranty</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-clock" aria-hidden="true"></i>
          <span>24/7 Response</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-star" aria-hidden="true"></i>
          <span>&#9733; 4.9 Rating</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-calendar-check" aria-hidden="true"></i>
          <span>Est. 2015</span>
        </div>
        <div class="trust-item" role="listitem">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>Background-Checked</span>
        </div>
      </div>
'@

# Update index.html trust bar (has role attributes)
$indexFile = Join-Path $rootDir "index.html"
$content = Get-Content -Path $indexFile -Raw -Encoding UTF8
$content = $content -replace [regex]::Escape($oldTrustBarPatterns[0]), $newTrustBarWithRoles
Set-Content -Path $indexFile -Value $content -Encoding UTF8 -NoNewline
Write-Host "  [TRUST BAR] Updated: index.html" -ForegroundColor Green

# Update all other HTML files trust bar (without role attributes)
$trustBarUpdated = 0
$allHtmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -File | Where-Object { $_.Name -ne "index.html" }

# New trust bar without role attributes
$newTrustBarSimple = @'
<div class="trust-items">
        <div class="trust-item"><i class="fas fa-shield-alt"></i><span>Licensed & Insured</span></div>
        <div class="trust-item"><i class="fas fa-award"></i><span>5-Year Warranty</span></div>
        <div class="trust-item"><i class="fas fa-clock"></i><span>24/7 Response</span></div>
        <div class="trust-item"><i class="fas fa-star"></i><span>&#9733; 4.9 Rating</span></div>
        <div class="trust-item"><i class="fas fa-calendar-check"></i><span>Est. 2015</span></div>
        <div class="trust-item"><i class="fas fa-user-shield"></i><span>Background-Checked</span></div>
      </div>
'@

foreach ($file in $allHtmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Match the simple trust bar pattern using regex
    $oldPattern = '<div class="trust-items">\s*<div class="trust-item"><i class="fas fa-shield-alt"></i><span>Licensed & Insured</span></div>\s*<div class="trust-item"><i class="fas fa-award"></i><span>5-Year Warranty</span></div>\s*<div class="trust-item"><i class="fas fa-clock"></i><span>24/7 Response</span></div>\s*<div class="trust-item"><i class="fas fa-star"></i><span>Local Experts</span></div>\s*</div>'
    
    if ($content -match $oldPattern) {
        $content = $content -replace $oldPattern, $newTrustBarSimple
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $trustBarUpdated++
        Write-Host "  [TRUST BAR] Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nTrust Bar: Updated $trustBarUpdated files (+ index.html)" -ForegroundColor Cyan

# ============================================================
# 3. ADD E-E-A-T CREDENTIAL BADGES CSS
# ============================================================

$eeatCSS = @'

/* =========================================
   E-E-A-T Trust & Credential Styles
   ========================================= */

/* Trust bar extra items */
.trust-item .fa-calendar-check,
.trust-item .fa-user-shield {
  color: inherit;
}

/* Customer review blockquotes */
#content blockquote {
  border-left: 4px solid #ff6b35;
  margin: 1.5em 0;
  padding: 1em 1.5em;
  background: rgba(34, 69, 121, 0.03);
  border-radius: 0 8px 8px 0;
}

#content blockquote p {
  font-style: italic;
  margin-bottom: 0.5em;
}

#content blockquote cite {
  display: block;
  font-style: normal;
  font-weight: 600;
  color: #224579;
  font-size: 0.9em;
}

/* Credentials list styling */
#content section ol {
  counter-reset: step-counter;
  list-style: none;
  padding-left: 0;
}

#content section ol li {
  counter-increment: step-counter;
  padding: 0.5em 0 0.5em 2.5em;
  position: relative;
}

#content section ol li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0.5em;
  background: #224579;
  color: white;
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85em;
}
'@

$cssFile = Join-Path $rootDir "assets\css\style.css"
$cssContent = Get-Content -Path $cssFile -Raw -Encoding UTF8
$cssContent += $eeatCSS
Set-Content -Path $cssFile -Value $cssContent -Encoding UTF8 -NoNewline
Write-Host "`n  [CSS] Added E-E-A-T styles to style.css" -ForegroundColor Green

# ============================================================
# 4. ADD BREADCRUMB SCHEMA TO KEY CATEGORY PAGES
# ============================================================

$categoryPages = @{
    "automotive.html" = @{ "name" = "Automotive Locksmith"; "position" = 2 }
    "residential.html" = @{ "name" = "Residential Locksmith"; "position" = 2 }
    "commercial.html" = @{ "name" = "Commercial Locksmith"; "position" = 2 }
    "emergency.html" = @{ "name" = "Emergency Locksmith"; "position" = 2 }
    "service-areas.html" = @{ "name" = "Service Areas"; "position" = 2 }
}

$breadcrumbAdded = 0
foreach ($page in $categoryPages.GetEnumerator()) {
    $filePath = Join-Path $rootDir $page.Key
    if (!(Test-Path $filePath)) { continue }
    
    $content = Get-Content -Path $filePath -Raw -Encoding UTF8
    
    # Skip if already has BreadcrumbList
    if ($content -match 'BreadcrumbList') { continue }
    
    $pageName = $page.Value["name"]
    $pageSlug = $page.Key
    
    $breadcrumbSchema = @"
    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.carcommercialresidentialemergencylocksmithservice.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "$pageName",
          "item": "https://www.carcommercialresidentialemergencylocksmithservice.com/$pageSlug"
        }
      ]
    }
    </script>
"@
    
    $content = $content -replace '</head>', "$breadcrumbSchema`n  </head>"
    Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
    $breadcrumbAdded++
    Write-Host "  [BREADCRUMB] Added to: $($page.Key)" -ForegroundColor Green
}

Write-Host "`nBreadcrumbs: Added to $breadcrumbAdded category pages" -ForegroundColor Cyan

# ============================================================
# SUMMARY
# ============================================================
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "E-E-A-T Enhancement Complete!" -ForegroundColor Yellow  
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Organization Schema: $schemaAdded pages updated" -ForegroundColor White
Write-Host "  Trust Bar: $($trustBarUpdated + 1) pages updated" -ForegroundColor White
Write-Host "  Breadcrumbs: $breadcrumbAdded pages updated" -ForegroundColor White
Write-Host "  CSS: E-E-A-T styles added" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Yellow
