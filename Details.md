# NovaPay / DemoShop — F5 Distributed Cloud WAAP Demo

Demo web estática + API serverless para Vercel. El objetivo es mostrar una aplicación productiva simulada y un laboratorio controlado de tráfico para validar detecciones de F5 Distributed Cloud WAAP/WAF usando siempre el dominio `demoshop.f5latam.app`.

## Estructura

```text
/
├── index.html
├── vercel.json
└── api/
    └── waf-lab.js
```

## Qué incluye

- Dashboard financiero de NovaPay/DemoShop.
- Generador de tráfico legítimo.
- Apartado separado **WAF Attack Lab**.
- Endpoint serverless `/api/waf-lab` para recibir requests de prueba.
- Usuarios, registro, perfiles, transacciones y actividad WAAP simulados en `localStorage`.
- Payloads controlados para SQLi, XSS, Path Traversal/LFI, Command Injection, SSRF, Recon y API Abuse.

## Corrección importante del WAF Attack Lab

La versión anterior podía fallar porque usaba `fetch` con headers custom y `Content-Type: application/json`. Cuando la app no se abría exactamente desde `https://demoshop.f5latam.app`, eso disparaba un preflight CORS `OPTIONS`; en ese caso el navegador podía no enviar el request real con el payload malicioso, por lo que F5 XC veía solamente el `OPTIONS` o el navegador mostraba error de CORS.

Esta versión corrige ese comportamiento:

- Si la app corre en `https://demoshop.f5latam.app`, usa URLs relativas como `/api/waf-lab`, por lo que no hay CORS.
- Si la app se abre desde un preview de Vercel u otro host, mantiene el target bloqueado a `https://demoshop.f5latam.app` y usa requests simples `no-cors` sin headers custom para forzar la emisión del request real.
- Los POST se envían como `text/plain;charset=UTF-8` para evitar preflight y permitir que WAAP inspeccione el body.
- El status real sólo será visible en la UI cuando la app se ejecute en el mismo dominio. Si se usa `no-cors`, el request se envía pero el status se debe validar desde los eventos de F5 Distributed Cloud.

## Despliegue en Vercel

1. Subir este proyecto a GitHub.
2. Importar el repo en Vercel.
3. Asociar el dominio `demoshop.f5latam.app` al proyecto.
4. Validar que `https://demoshop.f5latam.app/api/waf-lab?scenario=benign` responda JSON.
5. Abrir la app desde `https://demoshop.f5latam.app` y usar **WAF Attack Lab**.

## Validaciones sugeridas

1. En WAF Attack Lab presionar **Test Endpoint**.
2. Ejecutar un escenario individual, por ejemplo **SQL Injection**.
3. En F5 Distributed Cloud, revisar Security Events / WAAP Events para `demoshop.f5latam.app`.
4. Confirmar que los eventos contienen `/api/waf-lab?scenario=...` y el payload esperado.

## Seguridad de la demo

- No hay conexión a bases de datos.
- No hay ejecución de comandos.
- No hay acceso a archivos.
- No hay SSRF real ni conexiones salientes.
- Los payloads sólo se reflejan como metadata o son recibidos por el endpoint demo.
- El target no es editable desde la UI.
- Cada corrida está limitada a 30 requests.
