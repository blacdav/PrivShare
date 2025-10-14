import { Router } from "express";
import { GenNonce } from "../services/genNonce";
import { Siwe } from "../controllers/auth/siwe";

const router = Router();

router.route('/')
        .get(GenNonce)
        .post(Siwe)

export default router;