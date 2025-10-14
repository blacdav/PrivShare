import { Router } from "express";
import { RegPubKey } from "../controllers/users/create.user";
import { GetPubKey } from "../controllers/users/pubkey.controller";
import { AuthRequired } from "../middlewares/auth.middleware";

const router = Router();

router.route('/')
        .post(AuthRequired, RegPubKey)

router.route('/:wallet/pubkey')
        .get(GetPubKey)

export default router;