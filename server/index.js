const express = require("express");
const morgan = require("morgan");
const app = express();

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.set("port", process.env.PORT || 5000);

app.set("json spaces", 1);
app.use(express.json());
app.use(morgan("dev"));


app.use("/api", require("./api"));

app.use(express.static("public"));

app.listen(app.get("port"), () => {
  console.log(`server running on port ${app.get("port")}`);
});

app.use(express.static("public"));
