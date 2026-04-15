import "dotenv/config";
import app from "./src/app.js";
import dbConnect from "./src/common/config/db.js";

const PORT =process.env.PORT || 5000;

const start = async ()=>{

    // db connect
    try {
        await dbConnect();
    } catch (error) {
        console.log(`Database connection failed ${error}`)
    }

    app.listen(PORT,()=>{
        console.log(`Server is Running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`)
    })
}

start().catch((err)=>{
    console.log("Failed to start server",err)
    process.exit(1);
})