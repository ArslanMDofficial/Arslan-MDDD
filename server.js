const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Arslan-MD is running!"));
app.listen(process.env.PORT || 3000);
