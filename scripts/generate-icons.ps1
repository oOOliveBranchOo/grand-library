Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot '..\icons'
foreach ($size in @(192, 512)) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::FromArgb(255, 45, 47, 86))
  $pad = [int]($size * 0.15)
  $bw = $size - $pad * 2
  $bh = [int]($size * 0.55)
  $by = [int]($size * 0.28)
  $book = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 232, 192, 196))
  $g.FillRectangle($book, $pad, $by, $bw, $bh)
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 106, 16, 32)), ([float]($size * 0.015))
  $g.DrawRectangle($pen, $pad, $by, $bw, $bh)
  $spineH = [int]($size * 0.1)
  $spine = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 212, 184, 204))
  $sx = $pad + [int]($bw * 0.1)
  $sw = [int]($bw * 0.8)
  $g.FillRectangle($spine, $sx, ($by - $spineH), $sw, $spineH)
  $g.DrawRectangle($pen, $sx, ($by - $spineH), $sw, $spineH)
  $font = New-Object System.Drawing.Font ('Georgia', [single]($size * 0.22), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 106, 16, 32))
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Center'
  $sf.LineAlignment = 'Center'
  $rect = New-Object System.Drawing.RectangleF 0, ($by + $bh * 0.05), $size, ($bh * 0.8)
  $g.DrawString([char]0x2726, $font, $brush, $rect, $sf)
  $path = Join-Path $dir ("icon-$size.png")
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "Created $path"
}
