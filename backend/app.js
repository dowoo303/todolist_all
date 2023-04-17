const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

const app = express();

const port = 3010;

app.use(cors());
app.use(express.json()); // express가 json을 읽을 수 있게 하게 만들어줌
app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// 서버를 port에 할당
app.listen(port, () => {
  console.log(`Server listening on port : ${port} 🦉`);
});
