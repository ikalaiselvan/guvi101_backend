const express = require("express");
const connectDb = require("./db");
const signinRouter = require("./routes/signin");
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");


const cors = require("cors");

const app = express();


const PORT = 4000;

// middlewares
app.use(express.json());
app.use(cors({origin:"*"}))

connectDb();

app.get("/",(req, res)=>{
    res.send("hi this is get request")
});

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);



app.listen(PORT, ()=>{
    console.log("NodeJS is running on port : ", PORT);
})