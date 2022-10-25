const fs = require('fs');
students = [];
programs = [];

module.exports.initialize = function() {
    return new Promise((resolve,reject)=> {
        fs.readFile('./students.json', 'utf8', (err, data) => {
            if (err) {
                reject("Could not load students");
            }
            else{
                students = JSON.parse(data);
                fs.readFile('./programs.json', 'utf8', (err, data) => {
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

module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        if (studentData.isInternationalStudent == undefined) {
            studentData.isInternationalStudent = false;
        }
        else {
            studentData.isInternationalStudent = true;
        }
        function max() {
            var max = 0;
            students.forEach(student => {
                if(Number(student.studentID) > max) {
                    max = Number(student.studentID);
                }
            });
            return max+1;
        }
        const newStudentNumber = max();
        studentData.studentID = newStudentNumber.toString();
        students.push(studentData);
        resolve();
    });
}

module.exports.getStudentsByStatus = function(status){
    return new Promise((resolve, reject) =>{
        studentStatus = students.filter((student) => student.status.localeCompare(status) == 0)
        if(studentStatus.length == 0) {
            reject("No students with status: " + status); return;
        }
        resolve(studentStatus);
    });
}

module.exports.getStudentsByProgramCode = function(programCode){
    return new Promise((resolve, reject) =>{
        studentCode = students.filter((student) => student.program.localeCompare(programCode) == 0)
        if(studentCode.length == 0) {
            reject("No students with code: " + programCode); return;
        }
        resolve(studentCode);
    });
}

module.exports.getStudentsByExpectedCredential = function(credential){
    return new Promise((resolve, reject) =>{
        studentCred = students.filter((student) => student.expectedCredential && student.expectedCredential.localeCompare(credential) == 0);
        if(studentCred.length == 0) {
            reject("No students with credentials: " + credential); return;
        }
        resolve(studentCred);
    });
}

module.exports.getStudentById = function(sid) {
    return new Promise((resolve, reject) => {
        studentId = students.find((student) => student.studentID == sid);
        if(studentId) {
            resolve(studentId); return;
        }
        reject("No student with ID: " + sid);
    });
}

module.exports.updateStudent = function(studentData) {
    return new Promise ((resolve,reject) => {
        newStudent = students.find((student) => student.studentID == studentData.studentID);
            newStudent.firstName = studentData.firstName;
            newStudent.lastName = studentData.lastName;
            newStudent.email = studentData.email;
            newStudent.phone = studentData.phone;
            newStudent.addressStreet = studentData.addressStreet;
            newStudent.addressCity = studentData.addressCity;
            newStudent.addressState = studentData.addressState;
            newStudent.addressPostal = studentData.addressPostal;
            newStudent.status = studentData.status;
            newStudent.program = studentData.program;
            newStudent.credential = studentData.credential;
            if(studentData.international) {
                newStudent.isInternationalStudent = true;
            }
            else {
                newStudent.isInternationalStudent = false;
            }
            resolve(); 
    });
}