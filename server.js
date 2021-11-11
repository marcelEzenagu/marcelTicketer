const app = require("./index");
const connectDB = require("./db/db");

const PORT = 9080 || process.env.PORT

const start = async() => {
    try{
        await connectDB(process.env.MONGODB)
        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
    } catch(e){
        console.log(e)
    }
}

start()
