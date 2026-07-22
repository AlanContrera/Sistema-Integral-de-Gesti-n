from decimal import Decimal, ROUND_HALF_UP

def calcular_retorno(
    monto_depositado: Decimal, 
    pct_comision_empresa: Decimal, 
    pct_comision_promotor_1: Decimal, 
    pct_comision_promotor_2: Decimal, 
    cantidad_personas: int, 
    tarifa_bancaria_por_persona: Decimal, 
    comision_traslado: Decimal
) -> dict:
    """
    Calcula el desglose financiero exacto basado en las reglas para Retornos de Transferencia.
    Todos los porcentajes deben entrar como Decimales limpios (ej. Decimal('4.0') para 4%).
    """
    # 1. Subtotal = Monto Depositado sin IVA (Base matemática: Monto / 1.16)
    subtotal = (monto_depositado / Decimal('1.16')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    # 2. Factor de Retorno (Suma de comisiones)
    suma_comisiones = pct_comision_empresa + pct_comision_promotor_1 + pct_comision_promotor_2
    factor_division = Decimal('1') + (suma_comisiones / Decimal('100'))
    
    # 3. Monto Retornado
    monto_retornado = (monto_depositado / factor_division).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    # 4. Desglose de Comisiones (Se calculan sobre el Monto Retornado)
    comision_empresa_bruta = (monto_retornado * (pct_comision_empresa / Decimal('100'))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    comision_promotor_1 = (monto_retornado * (pct_comision_promotor_1 / Decimal('100'))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    comision_promotor_2 = (monto_retornado * (pct_comision_promotor_2 / Decimal('100'))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    comision_bancaria = (Decimal(cantidad_personas) * tarifa_bancaria_por_persona).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    # 5. Utilidades Finales
    # COMISION VALLUX = Comision Bruta - Bancaria - Traslado (Promotor se cobra al cliente, no a Vallux)
    comision_vallux = comision_empresa_bruta - comision_bancaria - comision_traslado
    
    utilidad_vallux = (comision_vallux / Decimal('2')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    comision_pedro = comision_vallux - utilidad_vallux  # Resta para que cuadre exacto hasta el último centavo
    
    return {
        'monto_depositado': float(monto_depositado),
        'subtotal': float(subtotal),
        'suma_comisiones_pct': float(suma_comisiones),
        'monto_retornado': float(monto_retornado),
        'comision_empresa_bruta': float(comision_empresa_bruta),
        'comision_promotor_1': float(comision_promotor_1),
        'comision_promotor_2': float(comision_promotor_2),
        'comision_bancaria': float(comision_bancaria),
        'comision_traslado': float(comision_traslado),
        'comision_vallux_neta': float(comision_vallux),
        'utilidad_vallux': float(utilidad_vallux),
        'comision_pedro': float(comision_pedro)
    }
