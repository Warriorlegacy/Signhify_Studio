# Signhify Outreach Engine — v1.0
# Run: powershell -ExecutionPolicy Bypass -File scripts/execute-outreach.ps1

$C = @{ Cyan = "Cyan"; Yellow = "Yellow"; Green = "Green"; Red = "Red"; Magenta = "Magenta" }

function Log($color, $msg) {
  if ($host.UI.RawUI.ForegroundColor) { Write-Host $msg -ForegroundColor $color }
  else { Write-Host $msg }
}

function Hr() { Write-Host ("-" * 70) -ForegroundColor DarkGray }

# --- Config ----------------------------------------------------------
$SCRIPT_DIR   = Split-Path -Parent $PSCommandPath
$REPO_ROOT    = Resolve-Path "$SCRIPT_DIR\.."
$LEADS_LOG    = "$REPO_ROOT\scripts\outreach-log.csv"
$DATE         = Get-Date -Format "yyyy-MM-dd"
$WEEK         = (Get-Date).DayOfYear / 7 -as [int]
$LEADS_CACHE  = "$REPO_ROOT\scripts\.leads-sent.json"
$MAX_DAILY    = 10
$LINKEDIN_MAX = 5

# --- State -----------------------------------------------------------
if (!(Test-Path $LEADS_LOG)) {
  Set-Content -Path $LEADS_LOG -Value "date,prospect,company,channel,touch,status,notes"
}
if (!(Test-Path $LEADS_CACHE)) {
  Set-Content -Path $LEADS_CACHE -Value "[]"
}

# --- Step 0: Daily Preflight -----------------------------------------
Clear-Host
Log $C.Cyan "Signhify Outreach Engine -- $(Get-Date -Format 'ddd MM/dd/yyyy')"
Hr

# --- Step 1: Prospect Sources ----------------------------------------
Log $C.Yellow "`nStep 1: Prospect Sources"
Hr

# 1a -- Product Hunt recent launches
$PH_URL = "https://api.producthunt.com/v2/api/graphql"
$PH_QUERY = '{ posts(order: NEWEST, first: 15) { nodes { name tagline website url votesCount } } }'

try {
  $PH_BODY = @{ query = $PH_QUERY } | ConvertTo-Json
  $PH_RESP = Invoke-RestMethod -Uri $PH_URL -Method POST -Body $PH_BODY -ContentType "application/json" -ErrorAction Stop
  $PH_POSTS = $PH_RESP.data.posts.nodes
  Log $C.Green "  [OK] Product Hunt: $($PH_POSTS.Count) recent launches"
  $PH_POSTS | ForEach-Object { Log $C.Yellow "    ^ $($_.votesCount)v $($_.name) -- $($_.tagline)" }
} catch {
  Log $C.Red "  [--] Product Hunt: unavailable (using fallback)"
  $PH_POSTS = @()
}

# 1b -- GitHub trending repos
try {
  $GH_HTML = Invoke-RestMethod -Uri "https://github.com/trending?since=weekly" -ErrorAction Stop
  $GH_REPOS = ([regex]::Matches($GH_HTML, 'href="/([^/"]+/[^/"]+)"')).Value -replace 'href="/','' | Select-Object -First 10
  Log $C.Green "  [OK] GitHub trending: $($GH_REPOS.Count) repos"
  $GH_REPOS | ForEach-Object { Log $C.Yellow "    * $_" }
} catch {
  Log $C.Red "  [--] GitHub trending: fetch failed"
  $GH_REPOS = @()
}

# 1c -- Indie Hackers
try {
  $IH_HTML = Invoke-RestMethod -Uri "https://www.indiehackers.com/" -ErrorAction Stop
  $IH_TITLES = ([regex]::Matches($IH_HTML, 'class="[^"]*post-title[^"]*"[^>]*>([^<]+)')).Groups[1].Value | Select-Object -First 8
  Log $C.Green "  [OK] Indie Hackers: $($IH_TITLES.Count) recent posts"
  $IH_TITLES | ForEach-Object { Log $C.Yellow "    > $_" }
} catch {
  Log $C.Red "  [--] Indie Hackers: fetch failed"
  $IH_TITLES = @()
}

# 1d -- Local seed list
$SEED_PROSPECTS = @(
  @{ Name = "Draftly";     Profile = "AI content platform";  Source = "Competitor" }
  @{ Name = "KickbacksAI"; Profile = "AI affiliate tool";    Source = "Local market" }
  @{ Name = "YC S26 batch";Profile = "Recent YC founders";   Source = "YC directory" }
)
Log $C.Green "  [OK] Seed prospects: $($SEED_PROSPECTS.Count) ready (fallback)"

# --- Step 2: Email Targets -------------------------------------------
Log $C.Yellow "`nStep 2: Email Batch -- Today's Targets"
Hr

$CACHE = Get-Content $LEADS_CACHE | ConvertFrom-Json
$TODAYS_BATCH = @()

$PH_POSTS | Select-Object -First 3 | ForEach-Object {
  $TODAYS_BATCH += [PSCustomObject]@{
    Prospect  = $_.name
    Company   = $_.name
    Channel   = "email"
    Subject   = "Quick question re: $($_.name)'s AI product plans"
    Template  = "cold-founders"
    SourceURL = $_.website
  }
}

if ($TODAYS_BATCH.Count -eq 0) {
  Log $C.Yellow "  (no live sources -- using seed list)"
  $SEED_PROSPECTS | ForEach-Object {
    $TODAYS_BATCH += [PSCustomObject]@{
      Prospect  = $_.Name
      Company   = $_.Name
      Channel   = "email"
      Subject   = "$($_.Name) -- 2-week AI SaaS build slot"
      Template  = "cold-founders"
      SourceURL = ""
    }
  }
}

$TODAYS_BATCH = $TODAYS_BATCH | Select-Object -First $MAX_DAILY

foreach ($t in $TODAYS_BATCH) {
  $already = $CACHE | Where-Object { $_.prospect -eq $t.Prospect }
  if ($already) {
    Log $C.Yellow "  [skip] $($t.Prospect) -- already contacted touch $($already.touch)"
  } else {
    Log $C.Green  "  [send] $($t.Prospect) -- $($t.Subject)"
    $CACHE += [PSCustomObject]@{ prospect = $t.Prospect; company = $t.Company; channel = "email"; date = $DATE; touch = 1 }
  }
}
$CACHE | ConvertTo-Json | Set-Content $LEADS_CACHE -Force

# --- Step 3: Directory Queue -----------------------------------------
Log $C.Yellow "`nStep 3: Directory Listing Queue"
Hr

$DIRECTORIES = @(
  @{ Name="Clutch";       URL="https://clutch.co/profile/signhify-ai-studio";       Priority="HIGH";   Status="pending (needs 3 reviews)" }
  @{ Name="GoodFirms";    URL="https://www.goodfirms.co/company/signhify-ai-studio"; Priority="HIGH";   Status="pending (needs reviews)" }
  @{ Name="DesignRush";   URL="https://www.designrush.com/agency/profile/signhify";  Priority="HIGH";   Status="not submitted" }
  @{ Name="Google Business"; URL="https://business.google.com";                      Priority="HIGH";   Status="pending (verify postcard)" }
  @{ Name="Upwork";       URL="https://www.upwork.com/agency/signhify-ai-studio";    Priority="HIGH";   Status="draft ready" }
  @{ Name="Crunchbase";   URL="https://www.crunchbase.com/organization/signhify";    Priority="MEDIUM"; Status="not claimed" }
  @{ Name="AngelList";    URL="https://angel.co/company/signhify-ai-studio";         Priority="MEDIUM"; Status="not submitted" }
  @{ Name="Trustpilot";   URL="https://www.trustpilot.com/review/signhify.dpdns.org";Priority="MEDIUM"; Status="not created" }
  @{ Name="G2";           URL="https://www.g2.com/products/signhify-ai-studio";      Priority="MEDIUM"; Status="needs product entry" }
  @{ Name="Bark";         URL="https://www.bark.com/en/in/signhify-ai-studio";       Priority="MEDIUM"; Status="not submitted" }
  @{ Name="Sortlist";     URL="https://www.sortlist.com/agency/signhify-ai-studio";  Priority="MEDIUM"; Status="not submitted" }
)

foreach ($d in $DIRECTORIES) {
  $m = if ($d.Priority -eq "HIGH") { "!" } else { " " }
  Log $C.Yellow "  [$m] $($d.Priority) $($d.Name) -- $($d.Status)"
}
Log $C.Cyan "  Tip: complete 2 HIGH priority directories per week"

# --- Step 4: LinkedIn Content ----------------------------------------
Log $C.Yellow "`nStep 4: LinkedIn Content -- Week $WEEK"
Hr

$LINKEDIN_POSTS = @(
  @{ Week=1; Day="Tue"; Topic="Founder origin story";                                   Type="Text+image" }
  @{ Week=1; Day="Thu"; Topic="6-agent AI pipeline deep-dive";                          Type="Carousel" }
  @{ Week=2; Day="Tue"; Topic="Client case study -- shipped in 12 days";                Type="Text+screenshot" }
  @{ Week=2; Day="Thu"; Topic="BYOK enterprise trend";                                  Type="Text" }
  @{ Week=3; Day="Tue"; Topic="How I land clients without a sales team";                Type="Text" }
  @{ Week=3; Day="Thu"; Topic="Agency vs Sprint side-by-side";                          Type="Infographic" }
  @{ Week=4; Day="Tue"; Topic="Why TanStack Start over Next.js";                        Type="Technical" }
  @{ Week=4; Day="Thu"; Topic="What I learned building in public";                      Type="Text" }
)

$thisWeek = $LINKEDIN_POSTS | Where-Object { $_.Week -eq $WEEK }
if ($thisWeek) {
  foreach ($p in $thisWeek) {
    $today = (Get-Date).DayOfWeek
    if ($today -eq $p.Day) { Log $C.Green "  [TODAY] $($p.Topic)  [$($p.Type)]" }
    else                   { Log $C.Yellow "  [$($p.Day)] $($p.Topic)  [$($p.Type)]" }
  }
} else {
  Log $C.Yellow "  (calendar defined for weeks 1-4; recycling week 4)"
  $LINKEDIN_POSTS[-2,-1] | ForEach-Object {
    Log $C.Yellow "  [$($_.Day)] $($_.Topic)  [$($_.Type)]"
  }
}

# --- Step 5: Pipeline Health -----------------------------------------
Log $C.Yellow "`nStep 5: Pipeline Snapshot"
Hr

$PIPELINE = @(
  @{ Stage = "Lead sourced";     Count = (($CACHE | Where-Object { $_.touch -eq 1 }).Count + 5); Color = "Cyan" }
  @{ Stage = "Initial contact";  Count = ($CACHE | Where-Object { $_.touch -ge 1 }).Count;        Color = "Yellow" }
  @{ Stage = "Discovery call";   Count = 0;  Color = "Yellow" }
  @{ Stage = "Blueprint call";   Count = 0;  Color = "Magenta" }
  @{ Stage = "Proposal sent";    Count = 0;  Color = "Magenta" }
  @{ Stage = "Negotiation";      Count = 0;  Color = "Yellow" }
  @{ Stage = "Closed won";       Count = 0;  Color = "Green" }
  @{ Stage = "Delivered";        Count = 0;  Color = "Green" }
  @{ Stage = "Referral asked";   Count = 0;  Color = "Cyan" }
)

foreach ($p in $PIPELINE) {
  Log $p.Color "  $($p.Stage): $($p.Count)"
}

# --- Step 6: Today's Actions -----------------------------------------
Log $C.Yellow "`nStep 6: Today's Action Items"
Hr

$ACTIONS = @()

if ($TODAYS_BATCH.Count -gt 0) {
  $ACTIONS += "[EMAIL] Send $($TODAYS_BATCH.Count) cold emails (scripts/outreach-email-templates.md)"
}
if ((Get-Date).DayOfWeek -in @('Tuesday','Thursday')) {
  $post = $thisWeek | Where-Object { $_ -and (Get-Date).DayOfWeek -eq $_.Day }
  if ($post) { $ACTIONS += "[LINKEDIN] Publish: $($post.Topic)" }
}
$ACTIONS += "[DIRECTORY] Submit 1 listing (Clutch or GoodFirms -- need 3 client reviews)"
$ACTIONS += "[PROSPECT] Find 5 new prospects on ProductHunt/GitHub for tomorrow"
$ACTIONS += "[FOLLOWUP] Reply to anyone who responded in last 48h"
$ACTIONS += "[TWITTER] Post daily tip or thread (see twitter-content-calendar.md)"

$ACTIONS | ForEach-Object { Log $C.Magenta "  $_" }

# --- Summary ----------------------------------------------------------
Hr
Log $C.Green "`n[DONE] Outreach run complete -- $(Get-Date -Format 'HH:mm')"
Log $C.Cyan "       Emails today:   $($TODAYS_BATCH.Count) / $MAX_DAILY"
Log $C.Cyan "       Total tracked:  $($CACHE.Count) prospects"
Log $C.Cyan "       LinkedIn posts: $(($thisWeek | Measure-Object).Count)/wk due"
Log $C.Cyan "       Directories:    $(($DIRECTORIES | Where-Object { $_.Status -ne 'submitted' }).Count) pending"
Hr

Write-Host "`nReferences:" -ForegroundColor DarkGray
Write-Host "  Templates:   scripts/outreach-email-templates.md" -ForegroundColor DarkGray
Write-Host "  Directories: scripts/directory-listing-guide.md" -ForegroundColor DarkGray
Write-Host "  LinkedIn:    scripts/linkedin-content-calendar.md" -ForegroundColor DarkGray
Write-Host "  Twitter:     scripts/twitter-content-calendar.md" -ForegroundColor DarkGray
Write-Host "  ProductHunt: scripts/producthunt-launch.md" -ForegroundColor DarkGray
Write-Host "  Pitch Deck:  scripts/pitch-deck.md" -ForegroundColor DarkGray
Write-Host "  Pipeline:    scripts/sales-pipeline.md" -ForegroundColor DarkGray
Write-Host "`nShip it." -ForegroundColor Green