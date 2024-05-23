const express = require('express');
const app = express();
const fs = require('fs');
const config = require('./config/server.json');
const studentsFilePath = './config/students.json';

let port = process.env.PORT || config.port;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    const students = require(studentsFilePath).students;
    res.render('home.ejs', { students });
});

app.post('/newRecord', (req, res) => {
    let name = req.body.name;
    let address = req.body.address;
    let contact = req.body.contact;
    let email = req.body.email;

    let studentsData = require(studentsFilePath);
    studentsData.students.push(
        {
            "name": name,
            "address": address,
            "contact": contact,
            "email": email
        }
    );

    fs.writeFile(studentsFilePath, JSON.stringify(studentsData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to the file', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});