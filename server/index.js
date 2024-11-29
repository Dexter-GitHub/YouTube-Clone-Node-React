const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/users', require('./routes/users'));
app.use('/video', require('./routes/video'));
app.use('/subscribe', require('./routes/subscribe'));

app.use('/uploads', express.static('uploads'));

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
}

const port = 5000;
app.listen(port, () => {
    console.log(`Server Listening on port ${port}`)
})
