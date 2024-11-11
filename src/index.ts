import express from "express";
import { transferHandler } from "./modules/transactions/transferControllers";

const app = express();
app.use(express.json());

app.post("/transfer", transferHandler);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});