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
    res.send("retrieve students");
});

app.get("/intlstudents", (req,res) => {
    res.send("retrieve international students");
});

app.get("/programs", (req,res) => {
    res.send("retrieve programs");
});

app.use((req,res) => {
    res.status(404).send(`<h1>404 <br>NOT FOUND</br></h1>`);
})

dataService.initialize()
.then(() => app.listen(HTTP_PORT, onServerStart))
.catch((msg) => console.log(msg));


