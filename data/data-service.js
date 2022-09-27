students = [];
programs = [];

module.exports.intialize = function() {
    return new Promise((resolve,reject)=> {
        fs.readFile('./students.json', 'utf8', (err, data) => {
            if (err){
                reject("Cannot read file"); 
                return;
            }
            console.log(data);
            students = JSON.parse(data);
       }).then(fs.readFile('./programs.json', 'utf8', (err, data) => {
        if (err){
            reject("Cannot read file"); 
            return;
        }
        console.log(data);
        programs = JSON.parse(data);
    }));
       resolve();
    }); 
}