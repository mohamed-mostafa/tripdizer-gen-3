const app = require("express")();
const proxy = require("http-proxy-middleware");

const { routes } = require("./reverse-proxy-config.json");

const port = process.env.PORT || 8080;

const consoleLog = console.log;
const consoleInfo = console.info;
const consoleWarn = console.warn;
const consoleError = console.error;
console.log = console.info = console.warn = console.error = () => {};

for (route of routes) {
  try {
    const webServer = require(route.path);
    if (webServer.start) webServer.start();

    app.use(`/${route.route}`, proxy({ target: route.address }));
    route.started = true;
  } catch (error) {
    consoleLog(
      "\x1b[31m",
      `There is an error while starting: ${route.route},\n`,
      "\x1b[34m",
      error,
      "\x1b[0m"
    );
    route.started = false;
  }
}

app.listen(port, () => {
  routes.forEach(route => {
    if (route.started) {
      consoleLog(`${route.address} -> :${port}/${route.route}`, "\x1b[0m");
    }
  });
});

setTimeout(() => {
  console.log = consoleLog;
  console.info = consoleInfo;
  console.warn = consoleWarn;
  console.error = consoleError;
}, 1000);
