const express = require('express');
const router = require('./src/routes/route.js');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const app = express();

app.use(express.json());

const bodyParser = require('body-parser'); //
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000})); //

mongoose.connect("mongodb+srv://rohith:wb5T5JFful4l5YVB@cluster0.bpry8kq.mongodb.net/Fest-Website?retryWrites=true&w=majority", {
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected")).catch(err => console.log(err));

app.use('/', router);


app.all('/**', (req, res) => {
    res.status(404).send({ status: false, message: 'Page Not Found!' });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});