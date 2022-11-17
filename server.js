/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Keith Cao Student ID: 1443332211 Date: Nov. 17, 2022
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
const e = require('express');
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
    dataService.getPrograms()
    .then((data) => res.render('addStudent', {programs: data}))
    .catch(() => res.render('addStudent', {programs: []}));
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
        .then((students) => {
            if (students.length > 0) {
                res.render('students', {data:students});
            }
            else {
                res.render('students', {message:"no results"});
            }
        })
        .catch(() => res.render('students', {message:"no results"}));
    }
});

app.get("/student/:studentId", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    dataService.getStudentById(req.params.studentId).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
            console.log(data);
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    }).then(dataService.getPrograms)
    .then((data) => {
        viewData.programs = data; // store program data in the "viewData" object as "programs"

        // loop through viewData.programs and once we have found the programCode that matches
        // the student's "program" value, add a "selected" property to the matching 
        // viewData.programs object

        for (let i = 0; i < viewData.programs.length; i++) {
            if (viewData.programs[i].programCode == viewData.student.program) {
                viewData.programs[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.programs = []; // set programs to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    }).catch((err)=>{
        res.status(500).send("Unable to Show Students");
      });
});


app.get("/intlstudents", (req,res) => {
    dataService.getInternationalStudents()
    .then((students) => res.json(students))
    .catch((msg) => res.send(msg));
});

app.get("/programs", (req,res) => {
    dataService.getPrograms()
    .then((programs) => {
        if (programs.length > 0) {
            res.render('programs', {data: programs});
        }
        else {
            res.render('programs', {message: "no results"});
        }
    })
    .catch(() => res.render('programs', {message:"no results"}));
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
    dataService.updateStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch(() => console.log("could not update student"));
})

app.get("/programs/add", (req,res) => {
    res.render('addProgram');
});

app.post("/programs/add", (req,res) => {
    dataService.addProgram(req.body)
    .then(() => res.redirect("/programs"))
    .catch(() => console.log("Could not add program"));
});

app.post("/program/update", (req,res) => {
    dataService.updateProgram(req.body)
    .then(() => res.redirect("/programs"))
    .catch((err)=>{
        res.status(500).send("Unable to Update Program");
  });  
});

app.get("/program/:programCode", (req,res) => {
    dataService.getProgramByCode(req.params.programCode)
    .then((program) => {
        if (program.length == 0) {
            console.log(program);
            res.status(404).send("Program Not Found");
        }
        else {
            res.render('program',{data:program});
        }
    })
    .catch(() => res.status(404).send("Program Not Found"));
});

app.get("/program/delete/:programCode", (req,res) => {
    dataService.deleteProgramByCode(req.params.programCode)
    .then(() => res.redirect('/programs'))
    .catch(() => res.status(500).send("Unable to Remove Program / Program not found"));
});

app.get("/student/delete/:studentID", (req,res) => {
    dataService.deleteStudentById(req.params.studentID)
    .then(() => res.redirect("/students"))
    .catch(() => res.status(500).send("Unable to Remove Student / Student not found"))

});

app.use((req,res) => {
    res.status(404).send(`<h1>404 <br>NOT FOUND</br></h1>`);
})

dataService.initialize()
.then(() => app.listen(HTTP_PORT, onServerStart))
.catch((msg) => console.log(msg));


