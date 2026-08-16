import express from "express";
import memberController from "./controllers/member.controller";
const router = express.Router();

router.post("/signup", memberController.signup);

export default router;