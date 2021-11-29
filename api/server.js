// import packages
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
// import multiparty from 'multiparty';
import methodoveride from 'method-override';
// import routes
import user from './routes/user';
import create from './routes/createPage';
import Bid from './routes/biding';
// config
import config from './config/config';
import fileupload from 'express-fileupload';
// import multipart from 'connect-multiparty';

// import dotenv from 'dotenv';
// dotenv.config({ path: `./env/.env.${process.env.NODE_ENV}` })

import v1 from './v1/routesFrontend/v1.routes';

const app = express();
const server = http.createServer(app);

// compress responses
app.use(morgan("dev"))
app.options('*', cors());
app.use(fileupload())

app.use(methodoveride())
// app.use(express.multiparty())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// const multipartMiddleware = multipart({ maxFieldsSize: (20 * 1024 * 1024) });
// app.use(multipartMiddleware);
app.use(passport.initialize());
// include passport stratagy
require("./v1/admin/config/passport").usersAuth(passport)
require("./v1/admin/config/passport").adminAuth(passport)
console.log(">>>>>>>>__dirname",__dirname);
app.use('/', express.static(path.join(__dirname, 'public')))

// Database connection 'mongodb://paruser:D8kbt478eo5@192.53.121.26:12743/zensdb'
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() =>
    console.log('MongoDB successfully connected.',config.mongoURI)
).catch(err => console.log(err));

app.use("/v1", v1);

// app.use("/admin", admin);
app.use("/user", user);
app.use("/create", create);
app.use("/bid", Bid)
app.get('/jon', (req, res) => {
    return res.send("User Service Working")
})

server.listen(config.port, function () {
    console.log(`server is running on port ${config.port}`)
});