//1.

const express = require("express");
const users = require("./data");
const app = express();
const port = 3000;

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
