// =====================================at EC2
/* 
const https = require('https'); 
const fs = require('fs');
*/
// =====================================at EC2
const express = require('express');
const app = express();
const sleepCare = require("./controller/router.js")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const { swaggerUi, specs } = require("./swagger_lib/swagger")
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.get('/', sleepCare);
app.get('/authorize',sleepCare);
app.get('/callback', sleepCare);
app.get('/user/:id', sleepCare);
app.post('/user/:id', sleepCare);
app.get('/user/:id/sleep', sleepCare);

app.listen(3000, function () {
    console.log('3000 port listen !!')
})

//======================== atEC2
/* 
options = {
    key: fs.readFileSync('./rootca.key'),
    cert: fs.readFileSync('./rootca.crt')
};
const server = https.createServer(options, app);
server.listen(443, () => {
    console.log('HTTPS, port = ' + 443);
})
*/
//======================== at EC2
