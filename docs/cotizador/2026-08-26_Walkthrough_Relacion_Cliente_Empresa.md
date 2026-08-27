# Walkthrough: Relación Dinámica Cliente-Empresa Emisora (2026-08-26)

Este documento detalla la reestructuración del flujo de selección en el cotizador, implementando una relación de base de datos directa para optimizar la Experiencia de Usuario (UX).

## 1. Cambios en Base de Datos
Se añadió una relación ManyToMany en el modelo Cliente apuntando a EmpresaEmisora. Esto permite que un cliente tenga múltiples empresas vinculadas y viceversa, sirviendo como catálogo autorizado de facturación por cliente.

## 2. Ingesta de Datos (Excel)
Se creó un script de migración que extrae la matriz de relaciones desde CLIENTES X EMPRESAS.xlsx. El script utiliza rellenado lógico (fill de pandas) para arrastrar el nombre del cliente a todas sus empresas en la matriz, buscando coincidencias en la base de datos y creando los vínculos.

## 3. Actualización de Interfaz (Frontend)
El componente FormularioPreFactura.jsx fue reestructurado visual y lógicamente:
- **Orden de Flujo:** Ahora el usuario debe seleccionar obligatoriamente al Cliente primero.
- **Selectores Inteligentes:** El selector de "Empresa que Factura" se mantiene bloqueado (disabled) hasta que se elige un cliente. Una vez seleccionado, el listado de empresas se reduce **únicamente a las empresas vinculadas** a ese cliente específico. Si el cliente no tiene empresas vinculadas registradas, se muestran todas por defecto como mecanismo de respaldo.
