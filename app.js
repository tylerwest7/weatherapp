const express = require("express");
const app = express();

const path = require("path");

//const buildpath = path.resolve(__dirname + '/client', 'build', 'index.html');

const port = process.env.PORT || 2000;

if(process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'));
    app.get('*', (req,res) => {
        req.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log(`server running on port ${port}`);
    //console.log(`The build path is ${buildpath}`)
})