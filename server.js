/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Keith Cao Student ID: 1443332211 Date: Oct. 25, 2022
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
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs',
helpers: {
    navLink: function(url, options){
        return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
} }));
app.set('view engine', '.hbs');

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

app.use(function(req, res, next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", (req,res) => {
    res.render('home');
});

app.get("/about", (req,res) => {
    res.render('about');
});

app.get("/students/add", (req,res) => {
    res.render('addStudent');
});

app.get("/images/add", (req,res) => {
    res.render('addImage');
});

app.get("/students", (req,res) => {
    if(req.query.status) {
        dataService.getStudentsByStatus(req.query.status)
        .then((students) => res.render('students', {data:students}))
        .catch(() => res.render('students', {message:"no results"}));
    }
    else if(req.query.program) {
        dataService.getStudentsByProgramCode(req.query.program)
        .then((students) => res.render('students', {data:students}))
        .catch(() => res.render('students', {message:"no results"}));
    }
    else if (req.query.credential) {
        dataService.getStudentsByExpectedCredential(req.query.credential)
        .then((students) => res.render('students', {data:students}))
        .catch(() => res.render('students', {message:"no results"}));
    }
    else {
        dataService.getAllStudents()
        .then((students) => res.render('students', {data:students}))
        .catch(() => res.render('students', {message:"no results"}));
    }
});

app.get("/student/:value", (req,res) => {
    dataService.getStudentById(req.params.value)
    .then((student) => res.render('student',{student:student}))
    .catch(() => res.render('student', {message:"no results"}));
});

app.get("/intlstudents", (req,res) => {
    dataService.getInternationalStudents()
    .then((students) => res.json(students))
    .catch((msg) => res.send(msg));
});

app.get("/programs", (req,res) => {
    dataService.getPrograms()
    .then((programs) => res.render('programs', {data: programs}))
    .catch((msg) => res.send(msg));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req,res) => {
    fs.readdir('./public/images/uploaded', (err, images) => {
        res.render('images', {data: images});
    });
});

app.post("/students/add", (req, res) => {
    dataService.addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch(() => console.log("Could not add student"));
});

app.post("/student/update", (req, res) => {
    console.log(req.body);
    dataService.updateStudent(req.body)
    .then(() => res.redirect("/students"));
})

app.use((req,res) => {
    res.status(404).send(`<h1>404 <br>NOT FOUND</br></h1>`);
})

dataService.initialize()
.then(() => app.listen(HTTP_PORT, onServerStart))
.catch((msg) => console.log(msg));


