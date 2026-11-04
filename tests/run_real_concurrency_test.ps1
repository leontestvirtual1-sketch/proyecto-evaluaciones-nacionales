# ==============================================================================
# Suite de Certificación: Concurrencia Real Multi-Conexión PostgreSQL (F-03)
# ==============================================================================
# Ejecuta 26 peticiones en paralelo real a través de conexiones PostgreSQL
# independientes en Docker, validando serialización con advisory locks,
# límite estricto de tasa (25/min), aislamiento multi-tenant y compensación SMTP.
# ==============================================================================

$ErrorActionPreference = "Stop"
$CONTAINER = "supabase_db_Proyecto_Evaluaciones_Nacionales"
$DOCENTE_A = "613eeb91-0000-4f03-a200-000000000001"
$DOCENTE_B = "613eeb91-0000-4f03-a200-000000000002"
$PRUEBA_ID = "eval-f03-concurrent-test"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " PRUEBA DE CONCURRENCIA REAL ATOMICA (F-03) - DOCKER POSTGRESQL " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# FASE 0: SETUP DE FIXTURES
# ------------------------------------------------------------------------------
Write-Host "`n[Fase 0] Inicializando fixtures sinteticos..." -ForegroundColor Yellow
Get-Content "tests/test_f03_concurrent_setup.sql" -Raw | docker exec -i $CONTAINER psql -U postgres -d postgres -q
Write-Host "Fixtures listos." -ForegroundColor Green

try {
    # ------------------------------------------------------------------------------
    # FASE 1: 26 PETICIONES CONCURRENTES PARALELAS (DOCENTE A)
    # ------------------------------------------------------------------------------
    Write-Host "`n[Fase 1] Lanzando 26 peticiones simultaneas en paralelo real para Docente A..." -ForegroundColor Yellow
    $startTime = Get-Date

    $resultsA = 1..26 | ForEach-Object -Parallel {
        $idx = $_
        $cnt = $using:CONTAINER
        $doc = $using:DOCENTE_A
        $pru = $using:PRUEBA_ID
        $sql = "SELECT public.reservar_cupo_envio_evaluacion('$doc'::uuid, '$pru', 'alumno_$($idx)@test.cl', 'Alumno $idx', 'RBD-CONC-A', 25, 60);"
        
        $out = docker exec -i $cnt psql -U postgres -d postgres -t -A -c $sql
        [PSCustomObject]@{
            Index = $idx
            Raw   = $out.Trim()
        }
    } -ThrottleLimit 30

    $duration = (Get-Date) - $startTime
    Write-Host "26 peticiones completadas en $($duration.TotalMilliseconds) ms." -ForegroundColor Cyan

    $aprobadosA = 0
    $rechazadosA = 0
    $approvedIdsA = [System.Collections.Generic.List[string]]::new()

    foreach ($item in $resultsA) {
        try {
            $json = $item.Raw | ConvertFrom-Json
            if ($json.permitido -eq $true) {
                $aprobadosA++
                $approvedIdsA.Add($json.envio_id)
            } else {
                $rechazadosA++
            }
        } catch {
            Write-Host "Error parseando JSON de resultado $($item.Index): $($item.Raw)" -ForegroundColor Red
        }
    }

    Write-Host "Resultados Docente A: Aprobados=$aprobadosA | Rechazados=$rechazadosA" -ForegroundColor White
    if ($aprobadosA -ne 25 -or $rechazadosA -ne 1) {
        throw "FALLO CRITICO F-03: Se esperaban exactamente 25 aprobados y 1 rechazado. Obtenido: $aprobadosA aprobados, $rechazadosA rechazados."
    }
    Write-Host "PASS 1: Concurrencia real serializada con precision. Exactamente 25 solicitudes aprobadas y 1 rechazada." -ForegroundColor Green

    # ------------------------------------------------------------------------------
    # FASE 2: AISLAMIENTO MULTI-TENANT CONCURRENTE (DOCENTE B)
    # ------------------------------------------------------------------------------
    Write-Host "`n[Fase 2] Validando cuota independiente y concurrencia para Docente B..." -ForegroundColor Yellow

    $resultsB = 1..5 | ForEach-Object -Parallel {
        $idx = $_
        $cnt = $using:CONTAINER
        $doc = $using:DOCENTE_B
        $pru = $using:PRUEBA_ID
        $sql = "SELECT public.reservar_cupo_envio_evaluacion('$doc'::uuid, '$pru', 'alumno_b_$($idx)@test.cl', 'Alumno B $idx', 'RBD-CONC-B', 25, 60);"
        
        $out = docker exec -i $cnt psql -U postgres -d postgres -t -A -c $sql
        [PSCustomObject]@{
            Index = $idx
            Raw   = $out.Trim()
        }
    } -ThrottleLimit 10

    $aprobadosB = 0
    foreach ($item in $resultsB) {
        $json = $item.Raw | ConvertFrom-Json
        if ($json.permitido -eq $true) {
            $aprobadosB++
        }
    }

    Write-Host "Resultados Docente B: Aprobados=$aprobadosB de 5" -ForegroundColor White
    if ($aprobadosB -ne 5) {
        throw "FALLO F-03: El agotamiento de cuota de Docente A interfirio con las solicitudes de Docente B."
    }
    Write-Host "PASS 2: Aislamiento estricto verificado. Docente B opero con su propia cuota sin interferencia de A." -ForegroundColor Green

    # ------------------------------------------------------------------------------
    # FASE 3: PREVENCION DE CANCELACION CRUZADA (SEGURIDAD IDOR)
    # ------------------------------------------------------------------------------
    Write-Host "`n[Fase 3] Validando proteccion contra cancelacion cruzada (IDOR)..." -ForegroundColor Yellow
    $idParaProbar = $approvedIdsA[0]
    $sqlIdor = "SELECT public.cancelar_reserva_envio_evaluacion('$idParaProbar'::uuid, '$DOCENTE_B'::uuid);"
    $resIdor = (docker exec -i $CONTAINER psql -U postgres -d postgres -t -A -c $sqlIdor).Trim()

    if ($resIdor -ne "f") {
        throw "FALLO DE SEGURIDAD: Docente B pudo cancelar la reserva del Docente A (IDOR en cancelacion)."
    }
    Write-Host "PASS 3: Proteccion IDOR confirmada. Un docente no puede cancelar reservas ajenas." -ForegroundColor Green

    # ------------------------------------------------------------------------------
    # FASE 4: CANCELACION COMPENSATORIA Y REINTENTO DE ENVIO
    # ------------------------------------------------------------------------------
    Write-Host "`n[Fase 4] Validando cancelacion compensatoria legítima y devolucion de cupo..." -ForegroundColor Yellow
    $sqlCancel = "SELECT public.cancelar_reserva_envio_evaluacion('$idParaProbar'::uuid, '$DOCENTE_A'::uuid);"
    $resCancel = (docker exec -i $CONTAINER psql -U postgres -d postgres -t -A -c $sqlCancel).Trim()

    if ($resCancel -ne "t") {
        throw "FALLO F-03: La cancelacion legítima no devolvio 'true'."
    }
    Write-Host "Cancelacion legitima ejecutada exitosamente." -ForegroundColor Gray

    # Reintentar 1 peticion para Docente A (debe ser aprobada)
    $sqlRetry = "SELECT public.reservar_cupo_envio_evaluacion('$DOCENTE_A'::uuid, '$PRUEBA_ID', 'reintento@test.cl', 'Alumno Reintento', 'RBD-CONC-A', 25, 60);"
    $resRetry = ((docker exec -i $CONTAINER psql -U postgres -d postgres -t -A -c $sqlRetry).Trim() | ConvertFrom-Json)

    if ($resRetry.permitido -ne $true) {
        throw "FALLO F-03: Tras cancelar una reserva, el reintento del Docente A debio ser aprobado."
    }
    Write-Host "Reintento 1 aprobado exitosamente." -ForegroundColor Gray

    # Intentar 1 peticion adicional para Docente A (debe ser rechazada)
    $sqlExceed = "SELECT public.reservar_cupo_envio_evaluacion('$DOCENTE_A'::uuid, '$PRUEBA_ID', 'sobrante@test.cl', 'Alumno Sobrante', 'RBD-CONC-A', 25, 60);"
    $resExceed = ((docker exec -i $CONTAINER psql -U postgres -d postgres -t -A -c $sqlExceed).Trim() | ConvertFrom-Json)

    if ($resExceed.permitido -ne $false) {
        throw "FALLO F-03: El envio numero 26 tras devolucion no fue bloqueado."
    }
    Write-Host "PASS 4: Cancelacion compensatoria restituye exactamente 1 cupo y el limite 25 se mantiene inquebrantable." -ForegroundColor Green

} finally {
    # ------------------------------------------------------------------------------
    # FASE 5: TEARDOWN Y VERIFICACION DE LIMPIEZA TOTAL
    # ------------------------------------------------------------------------------
    Write-Host "`n[Fase 5] Ejecutando teardown y limpieza de base de datos..." -ForegroundColor Yellow
    Get-Content "tests/test_f03_concurrent_teardown.sql" -Raw | docker exec -i $CONTAINER psql -U postgres -d postgres -q

    $sqlCheck = "SELECT count(*) FROM public.evaluacion_envios WHERE docente_id IN ('$DOCENTE_A'::uuid, '$DOCENTE_B'::uuid);"
    $remaining = (docker exec -i $CONTAINER psql -U postgres -d postgres -t -A -c $sqlCheck).Trim()

    if ($remaining -eq "0") {
        Write-Host "PASS 5: Base de datos limpia. 0 filas residuales." -ForegroundColor Green
    } else {
        Write-Host "ADVERTENCIA: Quedaron $remaining filas de prueba en evaluacion_envios." -ForegroundColor Red
    }
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " CERTIFICACION CONCURRENTE REAL DE F-03: 100% EXITOSA " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

