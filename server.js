const http = require("http");
const path = require("path");
const fs = require("fs");

const port = process.env.PORT || 3000;
const root = __dirname;

const mime = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(res, status, data, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=UTF-8" });
  res.end(data);
}

const server = http.createServer((req, res) => {
  const safePath = req.url.split("?")[0].replace(/\\/g, "/");
  const requested = safePath === "/" ? "/index.html" : safePath;
  const filePath = path.join(root, requested);

  // Prevent directory traversal outside root
  if (!filePath.startsWith(root)) {
    return send(res, 403, "Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return send(res, 404, "Not Found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        return send(res, 500, "Server Error");
      }
      send(res, 200, data, type);
    });
  });
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
