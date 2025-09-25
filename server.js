
import app from "./app.js";

//  Use Enviromental value for port and use 800 as default port
const PORT  = process.env.PORT || 8000

app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`)
})