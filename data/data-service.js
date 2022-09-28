const fs = require('fs');
students = [];
programs = [];

module.exports.initialize = function() {
    return new Promise((resolve,reject)=> {
        fs.readFile('./data/students.json', 'utf8', (err, data) => {
            if (err) {
                reject("Could not load students");
            }
            else{
                students = JSON.parse(data);
                fs.readFile('./data/programs.json', 'utf8', (err, data) => {
                    if (err) {
                        reject("Could not load programs");
                    }
                    else {
                        programs = JSON.parse(data);
                        resolve();
                    }
                })
            }
       })
    }); 
}

module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        if(programs.length == 0) {
            reject("No students found"); return;
        }
        else {
            resolve(students);
        }
    });
}

module.exports.getInternationalStudents = function() {
    return new Promise((resolve, reject) => {
        if(students.length == 0) {
            reject("No students found"); return;
        }
        else {
            internationalStudents = students.filter((e) => e.isInternationalStudent == true);
            resolve(internationalStudents);
        }
    });
}

module.exports.getPrograms = function() {
    return new Promise((resolve, reject) => {
        if(programs.length == 0) {
            reject("No programs found"); return;
        }
        else {
            resolve(programs);
        }
    });
}