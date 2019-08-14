const express = require("express");

const app = express();

const expressWs = require("express-ws")(app);

app.get("/", (req, res) => {
});

app.listen(5000);