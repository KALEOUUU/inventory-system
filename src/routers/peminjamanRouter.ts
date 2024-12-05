import { Router } from "express";
import { 
    userCreateRequest,
    userDeleteRequest,
    updateReturnDate,
    analyzeUsage,
    analyzeItemEfficiency
} from "../controller/peminjamanController";

import { verifyToken, verifyRole } from "../middleware/authorization";
import { createValidation } from "../middleware/validation";

const router = Router();

router.post("/borrow", [verifyToken, verifyRole(["USER"])], createValidation, userCreateRequest);
router.post("/return", [verifyToken, verifyRole(["USER", "ADMIN"])], updateReturnDate);
router.delete("/:id", [verifyToken, verifyRole(["USER", "ADMIN"])], userDeleteRequest);
router.post("/usage-report", [verifyToken, verifyRole(["ADMIN"])], analyzeUsage);
router.post("/borrow-analysis", [verifyToken, verifyRole(["ADMIN"])], analyzeItemEfficiency);

export default router;
