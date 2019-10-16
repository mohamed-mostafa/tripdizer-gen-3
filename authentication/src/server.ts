import app from "./app";

const start = () => {
  const port = process.env.PORT || 8081;
  app.listen(port, () => {
    console.log(
      "%s: \"authentication\" Node server started on %d ...",
      Date.now(),
      port
    );
  });
};

start();
