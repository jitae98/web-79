const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { users, posts } = require("./server/data"); // Đảm bảo đường dẫn đúng đến file data.js
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

// API lấy các bài post của user theo userId
app.get("/user/:id/posts", (req, res) => {
  const userId = req.params.id;
  const userPosts = posts.filter((post) => post.userId === userId);

  if (userPosts.length > 0) {
    res.json(userPosts);
  } else {
    res.status(404).send("No posts found for this user");
  }
});

// API tạo bài post cho user
app.post("/user/:id/posts", (req, res) => {
  const userId = req.params.id;
  const { content, isPublic } = req.body;

  // Kiểm tra user có tồn tại không
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Tạo post mới
  const newPost = {
    userId,
    postId: uuidv4(),
    content,
    createdAt: new Date().toISOString(),
    isPublic,
  };

  // Thêm post mới vào danh sách posts
  posts.push(newPost);

  res.status(201).json(newPost);
});

// API cập nhật bài post
app.put("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const { userId, content, isPublic } = req.body;

  // Tìm bài post và kiểm tra quyền sở hữu
  const postIndex = posts.findIndex(
    (post) => post.postId === postId && post.userId === userId
  );
  if (postIndex === -1) {
    return res
      .status(403)
      .json({ error: "Permission denied or post not found" });
  }

  // Cập nhật bài post
  posts[postIndex] = {
    ...posts[postIndex],
    content: content || posts[postIndex].content,
    isPublic: isPublic !== undefined ? isPublic : posts[postIndex].isPublic,
    updatedAt: new Date().toISOString(),
  };

  res.json(posts[postIndex]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
