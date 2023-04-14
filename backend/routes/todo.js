const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const client = new PrismaClient();

// 투두 생성
router.post("/", async (req, res) => {
  try {
    // 받아와야할 정보는 1. userId 2. todo 두가지
    const { todo, userId } = req.body;
    if (!todo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (!userId) {
      return res.status(400).json({ ok: false, error: "Not exist userId." });
    }

    // user가 존재하는지 체크
    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(400).json({ ok: false, error: "Not exist user." });
    }

    // 위 조건들이 모두 만족했다면 create data 후 res.json
    const newTodo = await client.todo.create({
      data: {
        todo,
        isDone: false,
        userId: user.id,
      },
    });

    res.json({ ok: true, todo: newTodo });
  } catch (error) {
    console.error(error);
  }
});

// 투두 조회
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // user가 존재하는지 체크
    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(400).json({ ok: false, error: "Not exist user." });
    }

    // findMany: 조건을 만족하는 여러가지 값 조회
    const todos = await client.todo.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    res.json({ ok: true, todos });
  } catch (error) {
    console.log(error);
  }
});

// 투두 완료 업데이트
router.put("/:id/done", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // id를 통해서 투두의 상태 값을 확인
    // todo의 주인이 맞는지 확인
    const existTodo = await client.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!existTodo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (!existTodo.userId !== parseInt(userId)) {
      return res
        .status(400)
        .json({ ok: false, error: "you are not todo owner" });
    }

    // 투두 상태 값 업데이트
    const updatedTodo = await client.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isDone: !existTodo.isDone,
      },
    });

    res.json({ ok: true, todo: updatedTodo });
  } catch (error) {
    console.error(error);
  }
});

// 투두 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // 삭제할 대상이 존재하는가?
    // 삭제요청한 대상이 todo의 주인인가?
    const existTodo = await client.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!existTodo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (existTodo.userId !== parseInt(userId)) {
      return res.status(400).json({ ok: false, error: "U R not todo owner." });
    }

    // 삭제 실행
    const deletedTodo = await client.todo.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ ok: true, todo: deletedTodo });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
