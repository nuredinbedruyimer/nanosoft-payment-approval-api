import express from "express";
import helmet from "helmet";
import cors from "cors"
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"


dotenv.config()
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

//  Use all routes below here
app.use('/auth', authRoutes);
app.use("/payment", paymentRoutes)

export default app