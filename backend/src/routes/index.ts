import express from "express";
import AuthRouter from "./auth.route";
import UserRouter from "./user.route";
import FileRouter from "./files.route";

const router = express();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use('/files', FileRouter);


export default router;