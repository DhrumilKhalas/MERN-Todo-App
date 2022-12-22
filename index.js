const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 7850;
const TodoItemRoute = require('./routes/todoItems');
const path = require("path")

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', TodoItemRoute);

const connection = () => {
    mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("Connected to MongoDB!")
    }).catch((err)=>{
        console.log(err)
    })
}

// serving the frontend
app.use(express.static(path.join(__dirname, "./client/todo-list-mernapp/build")))

app.get("*", function(_,res) {
    res.sendFile(
        path.join(__dirname, "./client/todo-list-mernapp/build/index.html"),
        function(err){
            res.status(500).send(err)
        }
    )
})

connection();

app.listen(PORT, () => {
   
    console.log(`Server is running on port: ${PORT}.`);
});