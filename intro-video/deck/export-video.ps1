# Let PowerPoint play the deck with its own timings and save it as a video (checks the animations).
#   powershell -File export-video.ps1
$deck = Join-Path $PSScriptRoot 'Mahmoud-Alyosify-Introduction.pptx'
$out  = Join-Path $PSScriptRoot '..\out\deck-playback.mp4'
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $p = $ppt.Presentations.Open($deck, $true, $false, $false)
  $p.CreateVideo([IO.Path]::GetFullPath($out), $true, 5, 720, 30, 85)
  while ($p.CreateVideoStatus -eq 1 -or $p.CreateVideoStatus -eq 2) { Start-Sleep -Seconds 3 }   # queued / in progress
  "status: " + $p.CreateVideoStatus + "  (3 = done)"
  $p.Close()
} finally { $ppt.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null }
