import express from "express";
import http from "http";
import path from "path";
import session from "express-session";
import 'dotenv/config'
import initApi from "./api/index.js";
import updater from "./lib/server/updater.js";

const PORT = process.env.PORT || 1930;

const app = express();
const server = http.createServer(app);

const dirname = process.cwd();
const publicPath = path.join(dirname, "public");
console.log(`Serving files from ${publicPath}`);
app.use("/lib/client", express.static(path.join(dirname, "lib/client")));
app.use(express.static(publicPath));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
updater(server, publicPath);

const main = async () => {
  await initApi(app);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
  });
};
main();
