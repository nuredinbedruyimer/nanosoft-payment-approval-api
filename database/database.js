import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config()

// console.log(process.env.HOST)
// console.log(process.env.PASSWORD)
// console.log(process.env.USER)


const pool = new Pool({
    host:process.env.HOST,
    port: process.env.POSTGRES_PORT, 
    user:process.env.USER, 
    password:process.env.PASSWORD, 
    database:process.env.DATABASE, 

})


export default pool