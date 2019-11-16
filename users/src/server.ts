import app from "./app";

const start = () => {
  const port = process.env.PORT || 8081;
  app.listen(port, () => {
    console.log(
      "%s: \"users\" Node server started on %d ...",
      new Date(Date.now()),
      port
    );
  });
};

start();
