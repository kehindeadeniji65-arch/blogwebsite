require("dotenv").config();
const express = require("express");
const cors= require("cors")
let app = express();
app.use(cors({
  origin: 'https://blogwebsite-seven-hazel.vercel.app',
  credentials: true,
}))
app.use(express.json());
const connectDB = require("./config/database");
const blogRoutes = require('./routes/blogsRoute')
const authRoutes = require('./routes/authRoute')

// const userRoutes = require('./routes/userRoute')

//connect to database
connectDB();
app.use(express.json());


// console.log(name,id,status)


//ROUTE = HTTP METHOD + URL
app.get('/', (req, res) => {
  res.send("Wecome to my blog API");
});


app.use('/api', blogRoutes)
app.use('/api', authRoutes)



//Authentication and Authorization
//JWT



//create server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server has started...");
});
