import { Router } from "express";
import { addFinancialRecord, getAllFinancialRecords, updateFinancialRecord, deleteFinancialRecord } from "../controller/transaction";
import { Createvalidation, deleteValidation } from "../middleware/validation";

const router = Router();

router.post("/", [Createvalidation], addFinancialRecord);
router.get("/:id", getAllFinancialRecords);
router.put("/:id", [updateFinancialRecord], updateFinancialRecord);
router.delete("/:id", [deleteValidation], deleteFinancialRecord);

export default router;