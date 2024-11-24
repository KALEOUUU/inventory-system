import Express  from "express";
import Transaction from "./routers/transactionRouters";

const app = Express();
app.use(Express.json());

app.use("/transaction", Transaction);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});