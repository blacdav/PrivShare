import { Router } from "express";
import { Upload } from "../controllers/files/upload";
import { Finalize } from "../controllers/files/finalize";
import { Revoke } from "../controllers/files/revoke";
import { File, Files } from "../controllers/files";
import { AuthRequired } from "../middlewares/auth.middleware";

const router = Router();

router.route('/')
        .post(AuthRequired, Files);

router.route(':_id/upload')
        .post(AuthRequired, Upload);

router.route(':_id/finalize')
        .post(AuthRequired, Finalize);

router.route(':_id/')
        .get(AuthRequired, File);

router.route(':_id/revoke')
        .post(AuthRequired, Revoke);

export default router;