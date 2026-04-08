const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { graphData } = require("./data/knowledge-graph-data");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const frontendDistDir = path.resolve(__dirname, "../frontend/dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";
  response.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(response);
}

function resolveStaticPath(requestPathname) {
  const normalizedPath = requestPathname === "/" ? "/index.html" : requestPathname;
  const candidatePath = path.normalize(path.join(frontendDistDir, normalizedPath));

  if (!candidatePath.startsWith(frontendDistDir)) {
    return null;
  }

  return candidatePath;
}

const server = http.createServer((request, response) => {
  if (!request.url || !request.method) {
    sendJson(response, 400, { message: "Invalid request." });
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/api/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (requestUrl.pathname === "/api/graph") {
    sendJson(response, 200, graphData);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { message: "Method not allowed." });
    return;
  }

  const requestedFile = resolveStaticPath(requestUrl.pathname);

  if (requestedFile && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    sendFile(response, requestedFile);
    return;
  }

  const fallbackFile = path.join(frontendDistDir, "index.html");
  if (fs.existsSync(fallbackFile)) {
    sendFile(response, fallbackFile);
    return;
  }

  sendJson(response, 503, {
    message: "Frontend build not found. Run `npm run build` in the project root before starting the server."
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Knowledge graph server is running at http://${HOST}:${PORT}`);
});
