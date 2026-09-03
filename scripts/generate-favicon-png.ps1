Add-Type -AssemblyName System.Drawing

$width = 128
$height = 128
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::Transparent)

# Fondo gradiente redondeado Indigo (#4f46e5 a #1e1b4b)
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$colorTop = [System.Drawing.Color]::FromArgb(255, 79, 70, 229)
$colorBot = [System.Drawing.Color]::FromArgb(255, 30, 27, 75)
$brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorTop, $colorBot, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)

# Path con esquinas redondeadas
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 28
$diameter = $radius * 2
$path.AddArc(0, 0, $diameter, $diameter, 180, 90)
$path.AddArc($width - $diameter, 0, $diameter, $diameter, 270, 90)
$path.AddArc($width - $diameter, $height - $diameter, $diameter, $diameter, 0, 90)
$path.AddArc(0, $height - $diameter, $diameter, $diameter, 90, 90)
$path.CloseFigure()

$g.FillPath($brushBg, $path)

# Borde sutil acento
$penAccent = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 129, 140, 248), 2)
$g.DrawPath($penAccent, $path)

# Birrete Académico (Graduation Cap)
# Rombo superior blanco
$capBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$ptsTop = @(
    (New-Object System.Drawing.PointF(64, 34)),
    (New-Object System.Drawing.PointF(108, 54)),
    (New-Object System.Drawing.PointF(64, 74)),
    (New-Object System.Drawing.PointF(20, 54))
)
$g.FillPolygon($capBrush, $ptsTop)

# Base del birrete
$baseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
$ptsBase = @(
    (New-Object System.Drawing.PointF(36, 62)),
    (New-Object System.Drawing.PointF(36, 84)),
    (New-Object System.Drawing.PointF(64, 98)),
    (New-Object System.Drawing.PointF(92, 84)),
    (New-Object System.Drawing.PointF(92, 62)),
    (New-Object System.Drawing.PointF(64, 75))
)
$g.FillPolygon($baseBrush, $ptsBase)

# Borla dorada (#facc15)
$goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 250, 204, 21), 3)
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
$g.DrawLine($goldPen, 100, 56, 94, 88)
$g.FillEllipse($goldBrush, 91, 86, 7, 7)

# Guardar PNG en public
$outputPath = Join-Path $PSScriptRoot "..\public\favicon.png"
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

Write-Host "✅ Favicon PNG generado con éxito en: $outputPath"
