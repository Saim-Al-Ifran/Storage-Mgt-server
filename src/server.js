const app = require("./app");
const connectDB = require("./config/db");

app.listen(5000,async()=>{
    console.log('Server is listening on port 5000');
    await connectDB();
});