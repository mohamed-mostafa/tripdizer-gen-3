const app = require("express")();
const proxy = require("http-proxy-middleware");

const { routes } = require("./reverse-proxy-config.json");

for (route of routes) {
  const webServer = require(route.path);
  webServer.start();

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
