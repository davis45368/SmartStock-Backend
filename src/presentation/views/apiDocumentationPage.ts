const API_VERSION = '1.0.0';

export function renderApiDocumentationPage(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SmartStock Backend — Documentación API</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0f1419;
      --surface: #1a2332;
      --border: #2d3a4f;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --accent: #3b82f6;
      --accent-dim: #1e3a5f;
      --ok: #22c55e;
      --warn: #f59e0b;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f4f6f9;
        --surface: #fff;
        --border: #d8dee9;
        --text: #1a2332;
        --muted: #5c6b7f;
        --accent-dim: #dbeafe;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .wrap {
      max-width: 920px;
      margin: 0 auto;
      padding: 2rem 1.25rem 3rem;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    h1 {
      margin: 0 0 0.35rem;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .version {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent);
      background: var(--accent-dim);
      padding: 0.15rem 0.55rem;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }
    .lead { color: var(--muted); margin: 0; font-size: 1.05rem; }
    section { margin-bottom: 2.25rem; }
    h2 {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 0 0 1rem;
      color: var(--text);
    }
    ul.meta {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    ul.meta li {
      padding: 0.35rem 0;
      border-bottom: 1px solid var(--border);
    }
    ul.meta li:last-child { border-bottom: none; }
    ul.meta strong { color: var(--muted); font-weight: 500; min-width: 7rem; display: inline-block; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 0.65rem 0.85rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: var(--accent-dim);
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--muted);
    }
    tr:last-child td { border-bottom: none; }
    .method {
      font-family: ui-monospace, "Cascadia Code", monospace;
      font-weight: 700;
      font-size: 0.8rem;
    }
    .method-get { color: var(--ok); }
    .method-post { color: var(--warn); }
    .route { font-family: ui-monospace, monospace; font-size: 0.85rem; }
    .auth-yes { color: var(--warn); font-size: 0.85rem; }
    .auth-no { color: var(--ok); font-size: 0.85rem; }
    .endpoint-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem 1.15rem;
      margin-bottom: 1rem;
    }
    .endpoint-card h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      font-family: ui-monospace, monospace;
    }
    .endpoint-card p { margin: 0.35rem 0; font-size: 0.9rem; color: var(--muted); }
    pre {
      margin: 0.5rem 0 0;
      padding: 0.75rem 1rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow-x: auto;
      font-size: 0.8rem;
      line-height: 1.45;
    }
    code { font-family: ui-monospace, "Cascadia Code", monospace; }
    footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.85rem;
      color: var(--muted);
    }
    a { color: var(--accent); }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <span class="version">v${API_VERSION}</span>
      <h1>SmartStock Backend</h1>
      <p class="lead">
        Microservicio de inventario predictivo: stock de seguridad, alertas de reorden
        y despacho de órdenes de compra a proveedores.
      </p>
    </header>

    <section>
      <h2>Acerca del proyecto</h2>
      <ul class="meta">
        <li><strong>Stack</strong> TypeScript, Express, Supabase (Auth + PostgreSQL)</li>
        <li><strong>Arquitectura</strong> Hexagonal — dominio, infraestructura y presentación desacoplados</li>
        <li><strong>Autenticación</strong> JWT de Supabase Auth en rutas <code>/api/inventory/*</code></li>
        <li><strong>Cliente</strong> Frontend React (Vite) consume esta API</li>
      </ul>
    </section>

    <section>
      <h2>Resumen de endpoints</h2>
      <table>
        <thead>
          <tr>
            <th>Método</th>
            <th>Ruta</th>
            <th>Auth</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="route">/</td>
            <td class="auth-no">No</td>
            <td>Esta documentación</td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="route">/health</td>
            <td class="auth-no">No</td>
            <td>Health check del servicio</td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="route">/api/inventory</td>
            <td class="auth-yes">Bearer JWT</td>
            <td>Listar todos los productos</td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="route">/api/inventory/alerts</td>
            <td class="auth-yes">Bearer JWT</td>
            <td>Productos en punto de reorden</td>
          </tr>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="route">/api/inventory/update</td>
            <td class="auth-yes">Bearer JWT</td>
            <td>Registrar venta y actualizar stock</td>
          </tr>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="route">/api/inventory/orders</td>
            <td class="auth-yes">Bearer JWT</td>
            <td>Despachar orden de compra al proveedor</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Detalle de rutas públicas</h2>

      <div class="endpoint-card">
        <h3><span class="method method-get">GET</span> /health</h3>
        <p>Comprueba que el servicio está en ejecución.</p>
        <p><strong>Respuesta 200:</strong></p>
        <pre><code>{ "status": "ok" }</code></pre>
      </div>
    </section>

    <section>
      <h2>Detalle de rutas protegidas</h2>
      <p style="color: var(--muted); font-size: 0.9rem; margin: 0 0 1rem;">
        Todas requieren el header:
        <code>Authorization: Bearer &lt;token_supabase&gt;</code>
      </p>

      <div class="endpoint-card">
        <h3><span class="method method-get">GET</span> /api/inventory</h3>
        <p>Devuelve el inventario completo con métricas predictivas.</p>
        <p><strong>Respuesta 200:</strong></p>
        <pre><code>{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Producto",
      "stockActual": 10,
      "ventaPromedioDiaria": 2,
      "leadTime": 3,
      "stockSeguridad": 5,
      "supplier": "Proveedor",
      "requiresReorder": false,
      "suggestedOrderQuantity": 0
    }
  ]
}</code></pre>
        <p><strong>401:</strong> <code>{ "error": "Token de autenticación requerido." }</code> o token inválido.</p>
      </div>

      <div class="endpoint-card">
        <h3><span class="method method-get">GET</span> /api/inventory/alerts</h3>
        <p>Lista solo productos que requieren reorden (<code>requiresReorder: true</code>).</p>
        <p><strong>Respuesta 200:</strong> mismo formato que <code>GET /api/inventory</code>.</p>
      </div>

      <div class="endpoint-card">
        <h3><span class="method method-post">POST</span> /api/inventory/update</h3>
        <p>Registra una venta y recalcula el stock. Puede disparar notificación al proveedor.</p>
        <p><strong>Body (JSON):</strong></p>
        <pre><code>{
  "productId": "uuid-del-producto",
  "quantitySold": 1
}</code></pre>
        <p><strong>Respuesta 200:</strong></p>
        <pre><code>{
  "status": "success",
  "message": "Inventario procesado por algoritmo predictivo",
  "data": { /* producto actualizado, mismo schema que listado */ }
}</code></pre>
        <p><strong>400:</strong> parámetros inválidos o reglas de negocio (stock, producto no encontrado).</p>
      </div>

      <div class="endpoint-card">
        <h3><span class="method method-post">POST</span> /api/inventory/orders</h3>
        <p>Crea y despacha una orden de compra para un producto en reorden.</p>
        <p><strong>Body (JSON):</strong></p>
        <pre><code>{
  "productId": "uuid-del-producto"
}</code></pre>
        <p><strong>Respuesta 201:</strong></p>
        <pre><code>{
  "status": "success",
  "message": "Orden de compra despachada al proveedor",
  "data": {
    "id": "uuid",
    "productId": "uuid",
    "quantityOrdered": 10,
    "status": "pending",
    "supplier": "Proveedor",
    "createdAt": "2026-05-18T12:00:00.000Z"
  }
}</code></pre>
        <p><strong>400:</strong> producto no requiere reorden o solicitud inválida.</p>
        <p><strong>500:</strong> error interno — <code>{ "error": "Fallo Crítico Interno", "message": "..." }</code></p>
      </div>
    </section>

    <footer>
      SmartStock Backend · Arquitectura hexagonal ·
      <a href="/health">/health</a>
    </footer>
  </div>
</body>
</html>`;
}
