# ==================================================
# CRECEIDEAS – FINGERPRINT v1.1
# Windows Client + Windows Server
# PowerShell 2.0+
# ==================================================

# ---------- CONFIG ----------
$SESSION_URL  = "https://core.creceideas.cl/APIsession"
$REGISTER_URL = "https://core.creceideas.cl/jelp/fingerprint/register/"

# ---------- HELPERS ----------
function Safe-Get {
    param ($Block)
    try { & $Block } catch { $null }
}

function ISO8601 {
    (Get-Date).ToUniversalTime().ToString("o")
}

# ---------- SESSION ----------
try {
    $session = Invoke-RestMethod -Uri $SESSION_URL -Method POST -UseBasicParsing
    $SESSION_TOKEN = $session.token
} catch {
    Write-Error "No se pudo obtener sesión desde el servidor"
    exit 1
}

# ---------- UUID ----------
$uuid = Safe-Get {
    (Get-WmiObject Win32_ComputerSystemProduct).UUID
}

# ---------- USER ----------
$user = Safe-Get {
    @{
        nombre            = [Environment]::UserName
        dominio           = [Environment]::UserDomainName
        directorioInicio  = $env:USERPROFILE
        tipoSesion        = if ($env:SESSIONNAME -match "RDP") { "Remota" } else { "Local" }
    }
}

# ---------- OS / SYSTEM ----------
$os = Get-WmiObject Win32_OperatingSystem
$isServer = $os.ProductType -ne 1   # 1 = Workstation

$lastBoot = [Management.ManagementDateTimeConverter]::ToDateTime($os.LastBootUpTime)
$uptimeSpan = (Get-Date) - $lastBoot

$sistema = @{
    so            = $os.Caption
    version       = $os.Version
    build         = $os.BuildNumber
    arquitectura  = if ([IntPtr]::Size -eq 8) { "64-bit" } else { "32-bit" }
    idioma        = $os.OSLanguage
    timezone      = $os.TimeZone
    uptime        = "$($uptimeSpan.Days) days, $($uptimeSpan.Hours) hours"
    tipo          = if ($isServer) { "Windows Server" } else { "Windows Client" }
    rolServidor   = if ($isServer) {
        switch ($os.ProductType) {
            2 { "Domain Controller" }
            3 { "Member Server" }
            default { "Servidor" }
        }
    } else { $null }
}

# ---------- HARDWARE BASE ----------
$cs    = Get-WmiObject Win32_ComputerSystem
$bios  = Get-WmiObject Win32_BIOS
$board = Get-WmiObject Win32_BaseBoard
$cpu   = Get-WmiObject Win32_Processor

# ---------- RAM ----------
$ramModules = Get-WmiObject Win32_PhysicalMemory
$ramTotalGB = [math]::Round(($ramModules | Measure-Object Capacity -Sum).Sum / 1GB)

# ---------- STORAGE ----------
$almacenamiento = @()
Get-WmiObject Win32_DiskDrive | ForEach-Object {
    $almacenamiento += @{
        disco       = $_.Model
        tipo        = $_.MediaType
        capacidadGB = [math]::Round($_.Size / 1GB)
        serial      = $_.SerialNumber
        interfaz    = $_.InterfaceType
    }
}

# ---------- GPU (en servidores puede no existir) ----------
$graficos = Safe-Get {
    $g = Get-WmiObject Win32_VideoController | Select-Object -First 1
    @{
        nombre = $g.Name
        vramGB = if ($g.AdapterRAM) { [math]::Round($g.AdapterRAM / 1GB) } else { 0 }
        driver = $g.DriverVersion
    }
}

# ---------- NETWORK ----------
$interfaces = @()
Get-WmiObject Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled } | ForEach-Object {
    $interfaces += @{
        nombre        = $_.Description
        mac           = $_.MACAddress
        ipv4          = ($_.IPAddress | Where-Object { $_ -match "\." } | Select-Object -First 1)
        ipv6          = ($_.IPAddress | Where-Object { $_ -match ":" } | Select-Object -First 1)
        gateway       = ($_.DefaultIPGateway | Select-Object -First 1)
        dns           = $_.DNSServerSearchOrder
    }
}

# ---------- PUBLIC IP + GEO ----------
$ipPublica = Safe-Get {
    Invoke-RestMethod -Uri "https://api.ipify.org" -UseBasicParsing
}

$geo = Safe-Get {
    Invoke-RestMethod -Uri "https://ipapi.co/$ipPublica/json/" -UseBasicParsing
}

# ---------- USB ----------
$puertosUSB = (Get-WmiObject Win32_USBController | Measure-Object).Count

# ---------- BLUETOOTH ----------
$bluetooth = $false
if (Get-WmiObject Win32_PnPEntity | Where-Object { $_.Name -match "Bluetooth" }) {
    $bluetooth = $true
}

# ---------- MONITORS (puede no existir en server core) ----------
$monitores = @()
Safe-Get {
    Get-WmiObject Win32_DesktopMonitor | ForEach-Object {
        $monitores += @{
            fabricante = $_.MonitorManufacturer
            modelo     = $_.Name
            resolucion = "$($_.ScreenWidth)x$($_.ScreenHeight)"
        }
    }
}

# ---------- HARDWARE OBJECT ----------
$hardware = @{
    fabricante = $cs.Manufacturer
    modelo     = $cs.Model
    placaBase  = @{
        fabricante = $board.Manufacturer
        modelo     = $board.Product
        serial     = $board.SerialNumber
        bios       = @{
            fabricante = $bios.Manufacturer
            version    = $bios.SMBIOSBIOSVersion
            fecha      = $bios.ReleaseDate
        }
    }
    procesador = @{
        nombre        = $cpu.Name
        nucleos       = $cpu.NumberOfCores
        hilos         = $cpu.NumberOfLogicalProcessors
        frecuenciaMHz = $cpu.MaxClockSpeed
    }
    memoriaRAM = @{
        totalGB = $ramTotalGB
        slots   = ($ramModules | Measure-Object).Count
        usados  = ($ramModules | Where-Object { $_.Capacity }).Count
    }
    almacenamiento = $almacenamiento
    graficos       = $graficos
    red            = @{
        interfaces    = $interfaces
        ipPublica     = $ipPublica
        georeferencia = @{
            pais   = $geo.country_name
            region = $geo.region
            ciudad = $geo.city
            lat    = $geo.latitude
            lon    = $geo.longitude
        }
    }
    puertosUSB = $puertosUSB
    bluetooth  = $bluetooth
    monitores  = $monitores
}

# ---------- SOFTWARE ----------
$software = @{
    antivirus = if ($isServer) { "Defender / AV Corporativo" } else { "Windows Defender" }
    office    = $null
}

# ---------- FINAL PAYLOAD ----------
$fingerprint = @{
    uuid      = $uuid
    timestamp = (ISO8601)
    usuario   = $user
    sistema   = $sistema
    hardware  = $hardware
    software  = $software
}

$json = $fingerprint | ConvertTo-Json -Depth 12

# ---------- SEND ----------
Invoke-RestMethod `
    -Uri $REGISTER_URL `
    -Method POST `
    -Headers @{
        "Content-Type"    = "application/json"
        "x-session-token" = $SESSION_TOKEN
    } `
    -Body $json `
    -UseBasicParsing

Write-Host "Fingerprint enviado correctamente"