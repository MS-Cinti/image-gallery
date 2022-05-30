const express = require('express');
const fileUpload = require("express-fileupload");
const fs = require('fs');
const path = require('path');
const app = express();
const port = 9000;

app.use(fileUpload());
app.use(express.json());
app.use("/upload", express.static(`${__dirname}/../frontend/public/images`));

const pathToFrontend = path.join(`${__dirname}/../frontend`);
const dataLocation = path.join(`${__dirname}/../frontend/data/`);

const getImagesData = () => {
    const imageData = fs.readFileSync(`${__dirname}/../frontend/data/images.json`);
    return JSON.parse(imageData);
}

app.get('/', (req, res, next) => { 
    res.sendFile(path.join(`${pathToFrontend}/../frontend/index.html`));
})

app.get('/data', (req, res) => {
    console.log('Request received for users endpoint.');
    const output = getImagesData();
    res.send(output)
});

let jsonData = [];
try {
    let data = fs.readFileSync(`${dataLocation}images.json`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${dataLocation}images.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}

const images = path.join(`${__dirname}/../frontend/public/images/`);

app.post("/", (req, res) => {
    //console.log(req)
    const picture = req.files.fileName;

    const answer = {};
    if (picture) {
        picture.mv(images + picture.name, error => {
            return res.status(500).send(error);
        });
    }
    answer.pictureName  = picture.name;
    res.send(answer);

    const formData = req.body;
    formData.title = picture.name;
    jsonData.push(formData);

    fs.writeFile(`${dataLocation}images.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });    
})

//app.delete();

app.use('/public', express.static(`${pathToFrontend}/../frontend/public`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})