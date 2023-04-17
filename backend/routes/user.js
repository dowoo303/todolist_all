const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const client = new PrismaClient();

// 유저생성
router.post("/", async (req, res) => {
  // 기존과 다르게 async와 trycatch 등장
  try {
    const { account } = req.body; // JSON으로 받아온 것은 body 안에 들어있음

    // 데이터 베이스와 소통
    const existUser = await client.user.findUnique({
      // 중복된 값 확인
      where: {
        account,
      },
    });
    if (existUser) {
      return res
        .status(400)
        .json({ ok: false, error: "그 계정은 이미 존재합니다." });
    }

    const user = await client.user.create({
      data: {
        account,
      },
    });

    res.json({ ok: true, user });
  } catch (error) {
    console.error(error);
  }
});

// 유저조회
// 파라미터로 받아옴
router.get("/:account", async (req, res) => {
  try {
    const { account } = req.params; // 위 account와 이름이 같아야함 -> 파라미터에서 받아온건 params에 들어있음

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        error: "Not exist user.",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
