# NovaPay / DemoShop — F5 WAAP Demo App

Aplicación web estática preparada para Vercel y para ser publicada detrás de F5 Distributed Cloud usando el dominio `demoshop.f5latam.app`.

## Qué incluye

- Dashboard financiero estilo NovaPay.
- Generador de tráfico legítimo hacia `https://demoshop.f5latam.app`.
- Módulo separado **WAF Attack Lab** para enviar tráfico malicioso controlado y no destructivo.
- Perfiles locales, registro local, transacciones simuladas y actividad WAAP en `localStorage`.
- Endpoint serverless `/api/waf-lab` para que los requests tengan respuesta 200 cuando no sean bloqueados por WAAP.

## Deploy en Vercel

No requiere instalación local. Subir el contenido de esta carpeta como proyecto Vercel o conectar el repositorio.

Archivos principales:

- `index.html`
- `vercel.json`
- `api/waf-lab.js`

## Uso recomendado

1. Publicar la app en Vercel.
2. Apuntar `demoshop.f5latam.app` al deployment.
3. Publicar ese dominio detrás de F5 Distributed Cloud.
4. Ejecutar primero **Traffic Generator** para tráfico legítimo.
5. Ejecutar **WAF Attack Lab** para firmas SQLi, XSS, Traversal, Command Injection, SSRF, Recon y API Abuse.
6. Validar en F5 Distributed Cloud los eventos WAAP/WAF, Bot/Recon y API Security.

El WAF Attack Lab está limitado a ráfagas pequeñas y no permite editar el target desde la UI.
