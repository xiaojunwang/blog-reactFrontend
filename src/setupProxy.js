const proxy = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    proxy("/*", { target: "https://mighty-everglades-60793.herokuapp.com" })
  );
};
