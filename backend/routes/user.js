const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const client = new PrismaClient();

// 유저생성
router.post("/", async (req, res) => {
  // 기존과 다르게 async와 trycatch 등장
  try {
    const { account } = req.body;

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
router.get("/:account", async (req, res) => {
  try {
    const { account } = req.params;

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
