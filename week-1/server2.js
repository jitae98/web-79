const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { users } = require("./server/data");
const app = express();
const port = 3000;

app.use(express.json());

// API lấy thông tin user theo ID
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// API tạo user
app.post("/user", (req, res) => {
  const { userName, email, age, avatar } = req.body;

  // Kiểm tra email có tồn tại hay không
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Tạo user mới
  const newUser = {
    id: uuidv4(),
    userName,
    email,
    age,
    avatar,
  };

  // Thêm user mới vào danh sách users
  users.push(newUser);

  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
