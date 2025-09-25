import express from "express";
import helmet from "helmet";
import cors from "cors"


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

//  Use all routes below here

export default app