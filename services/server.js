const app = require("express")();
const proxy = require("http-proxy-middleware");

const { routes } = require("./reverse-proxy-config.json");

for (route of routes) {
  try {
    const webServer = require(route.path);
    if (webServer.start) webServer.start();
  } catch (error) {
    console.log(
      "\x1b[31m",
      `There is an error while starting: ${route.route},\n`,
      "\x1b[34m",
      error,
      "\x1b[0m"
    );
  }

  app.use(`/${route.route}`, proxy({ target: route.address }));
}

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("%s: Node server started on %d ...", Date(Date.now()), port);
});
