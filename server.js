/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Keith Cao Student ID: 1443332211 Date: Sept. 28, 2022
*
*  Online (Cyclic) Link: https://rich-jade-centipede-slip.cyclic.app/
*
********************************************************************************/ 


dataService = require('./data/data-service.js')
express = require('express');
app = express();
path = require('path');
app.use(express.static('public'));

HTTP_PORT = process.env.PORT || 8080;

function onServerStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/students", (req,res) => {
    dataService.getAllStudents()
    .then((students) => res.json(students))
    .catch((msg) => console.log(msg));
});

app.get("/intlstudents", (req,res) => {
    dataService.getInternationalStudents()
    .then((students) => res.json(students))
    .catch((msg) => console.log(msg));
});

app.get("/programs", (req,res) => {
    dataService.getPrograms()
    .then((programs) => res.json(programs))
    .catch((msg) => console.log(msg));
});

app.use((req,res) => {
    res.status(404).send(`<h1>404 <br>NOT FOUND</br></h1>`);
})

dataService.initialize()
.then(() => app.listen(HTTP_PORT, onServerStart))
.catch((msg) => console.log(msg));


