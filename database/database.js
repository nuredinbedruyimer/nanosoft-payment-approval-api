import { Pool } from "pg";

// console.log(process.env.HOST)

const pool = new Pool({
    host:process.env.HOST,
    port: process.env.POSTGRES_PORT, 
    user:process.env.USER, 
    password:process.env.PASSWORD, 
    database:process.env.DATABASE, 

})


export default pool