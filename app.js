const express = require('express');
const app = express();
const sleepCare = require("./controller/router.js")

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/', sleepCare);
app.get('/authorize',sleepCare);
app.get('/callback', sleepCare);
app.get('/user/:id', sleepCare);
app.post('/user/:id', sleepCare);
app.get('/user/:id/sleep', sleepCare);

app.listen(3000, function () {
    console.log('3000 port listen !!')
})