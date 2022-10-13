/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Keith Cao Student ID: 1443332211 Date: Oct. 13, 2022
*
*  Online (Cyclic) Link: https://rich-jade-centipede-slip.cyclic.app/
*
********************************************************************************/ 

const fs = require('fs');
dataService = require('./data-service.js')
express = require('express');
app = express();
path = require('path');
app.use(express.static('public'));
multer = require('multer')

HTTP_PORT = process.env.PORT || 8080;

function onServerStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
});

const upload = multer({storage: storage});

app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/students/add", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.get("/images/add", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.get("/students", (req,res) => {
    if(req.query.status) {
        dataService.getStudentsByStatus(req.query.status)
        .then((students) => res.json(students))
        .catch((msg) => res.send(msg));
    }
    else if(req.query.program) {
        dataService.getStudentsByProgramCode(req.query.program)
        .then((students) => res.json(students))
        .catch((msg) => res.send(msg));
    }
    else if (req.query.credential) {
        dataService.getStudentsByExpectedCredential(req.query.credential)
        .then((students) => res.json(students))
        .catch((msg) => res.send(msg));
    }
    else {
        dataService.getAllStudents()
        .then((students) => res.json(students))
        .catch((msg) => res.send(msg));
    }
});

app.get("/students/:value", (req,res) => {
    dataService.getStudentById(req.params.value)
    .then((student) => res.json(student))
    .catch((msg) => res.send(msg));
});

app.get("/intlstudents", (req,res) => {
    dataService.getInternationalStudents()
    .then((students) => res.json(students))
    .catch((msg) => res.send(msg));
});

app.get("/programs", (req,res) => {
    dataService.getPrograms()
    .then((programs) => res.json(programs))
    .catch((msg) => res.send(msg));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req,res) => {
    fs.readdir('./public/images/uploaded', (err, data) => {
        res.json({
            images: data
        });
    });
});

app.post("/students/add", (req, res) => {
    dataService.addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch(() => console.log("Could not add student"));
});

app.use((req,res) => {
    res.status(404).send(`<h1>404 <br>NOT FOUND</br></h1>`);
})

dataService.initialize()
.then(() => app.listen(HTTP_PORT, onServerStart))
.catch((msg) => console.log(msg));


