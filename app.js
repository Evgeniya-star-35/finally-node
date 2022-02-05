const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { HttpCode, LIMIT_JSON } = require("./lib/constants");

const { usersRoute } = require("./routes");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: LIMIT_JSON }));
app.use((req, res, next) => {
  app.set("lang", req.acceptsLanguages(["en", "ru"]));
  next();
});

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use("/api/users", usersRoute);
// app.use("/api/transaction", transactionRoute);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    status: "fail",
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});

module.exports = app;
