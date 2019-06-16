const express = require("express");
const proxy = require("http-proxy-middleware");

const { routes } = require("./reverse-proxy-config.json");

const app = express();

const requestsWebServer = require("../requests/hws_modules/webserver/hws_server.js");
const masterDataWebServer = require("../master-data/hws_modules/webserver/hws_server.js");

requestsWebServer.start();
masterDataWebServer.start();

for (route of routes) {
  app.use(
    route.route,
    proxy({
      target: route.address,
      pathRewrite: (path, req) => {
        return path
          .split("/")
          .slice(2)
          .join("/");
      }
    })
  );
}

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("%s: Node server started on %d ...", Date(Date.now()), port);
});
