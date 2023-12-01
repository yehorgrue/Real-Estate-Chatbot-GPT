const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./models");

const path = require("path");

// db.sequelize
//   .sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send({ result: "Welcome" });
});

require("./routes/chat.routes")(app);
require("./routes/user.routes")(app);

app.use(express.static(path.join(__dirname, "build")));

// For any other requests, serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5001);
