import { Router } from "express";
import { 
    createItem,
    updateItem,
    deleteItem,
    getAllItem
} 

    from "../controller/inventoryController";
import { verifyToken, verifyRole } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken, verifyRole(["ADMIN"])], createItem);
router.put("/:id", [verifyToken, verifyRole(["ADMIN"])], updateItem);
router.get("/", getAllItem);
router.delete("/:id", [verifyToken, verifyRole(["ADMIN"])], deleteItem);

export default router;