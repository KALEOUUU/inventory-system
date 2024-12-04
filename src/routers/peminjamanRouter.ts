import { Router } from "express";
import { 
    userCreateRequest,
    userGetAllRequest,
    userDeleteRequest,
    updateReturnDate
} from "../controller/peminjamanController";
import { verifyToken, verifyRole } from "../middleware/authorization";
const router = Router();

router.post("/borrow", [verifyToken, verifyRole(["USER"])], userCreateRequest);
router.get("/", [verifyToken, verifyRole(["USER", "ADMIN"])], userGetAllRequest);
router.post("/return", [verifyToken, verifyRole(["USER", "ADMIN"])], updateReturnDate);
router.delete("/:id", [verifyToken, verifyRole(["USER", "ADMIN"])], userDeleteRequest);

export default router;