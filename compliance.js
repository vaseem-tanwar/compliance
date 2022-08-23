var express = require('express');
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var path = require('path');
var methodOverride = require('method-override');
var _ = require('lodash');
var config = require("./config");
var fs = require('fs');
var cors = require('cors')
//========================Create the application======================
// This line is from the Node.js HTTPS documentation.
// var credentials = {
//     key: fs.readFileSync('/etc/letsencrypt/live/nodeserver.mydevfactory.com/privkey.pem', 'utf8'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/nodeserver.mydevfactory.com/fullchain.pem', 'utf8')
// };

var credentials = {
    key: fs.readFileSync('/var/www/ssl/myteammateappconz.key', 'utf8'),
    cert: fs.readFileSync('/var/www/ssl/25474380a038c922.crt', 'utf8'),
    ca: fs.readFileSync('/var/www/ssl/gd_bundle-g2-g1.crt', 'utf8')
};

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var server = require('https').createServer(credentials, app);
//var server = require('http').createServer(app);

app.set('port', config.port);
app.set('host', config.host);

//==============Add middleware necessary for REST API's===============
app.use(cors());
app.use(bodyParser.json(({ limit: '500000kb', extended: true, parameterLimit: 500000 * 100 })));
app.use(bodyParser.urlencoded({ limit: '500000kb', extended: true, parameterLimit: 500000 * 100 }));

express.json();
express.urlencoded({ extended: false });
app.use(fileUpload());
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
//==========Add module to recieve file from angular to node===========
app.use(express.static(__dirname + '/public'));
//===========================CORS support==============================

app.use(function (req, res, next) {
    // req.setEncoding('utf8');
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, user_id, authtoken,language");

    res.setHeader('Access-Control-Allow-Credentials', true);
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

//=========================Load the routes===============================
var adminRoutes = require('./routes/adminRoutes.js')(app, express);
app.use('/admin', adminRoutes);
var apiRoutes = require('./routes/apiRoutes.js')(app, express);
app.use('/api', apiRoutes);
var auditRoutes = require('./routes/auditRoutes.js')(app, express);
app.use('/api/audit', auditRoutes);
var riskRoutes = require('./routes/riskRoutes.js')(app, express);
app.use('/api/risk', riskRoutes);
var supplierRoutes = require('./routes/supplierRoutes.js')(app, express);
app.use('/api/supplier', supplierRoutes);
var hazardousRoutes = require('./routes/hazardousRoutes.js')(app, express);
app.use('/api/hazardous', hazardousRoutes);
var assetRoutes = require('./routes/assetRoutes.js')(app, express);
app.use('/api/asset', assetRoutes);
var hrRoutes = require('./routes/hrRoutes.js')(app, express);
app.use('/api/hr', hrRoutes);
var taskRoutes = require('./routes/taskRoutes.js')(app, express);
app.use('/api/task', taskRoutes);
var observationRoutes = require('./routes/observationRoutes.js')(app, express);
app.use('/api/observation', observationRoutes);
var reportChartRoutes = require('./routes/reportChartRoutes.js')(app, express);
app.use('/api/report', reportChartRoutes);
var formSubmissionRoutes = require('./routes/formSubmissionRoutes.js')(app, express);
app.use('/api/formSubmission', formSubmissionRoutes);

//===========================Connect to MongoDB==========================
// producation config or local config
var producationString = "mongodb://" + config.production.username + ":" + config.production.password + "@" + config.production.host + ":" + config.production.port + "/" + config.production.dbName + "?authSource=" + config.production.authDb;

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};
var db = mongoose.connect(producationString, options, function (err) {
    if (err) {
        console.log(err + "connection failed");
    } else {
        console.log('Connected to database ');
    }
});
//mongo on connection emit
mongoose.connection.on('connected', function (err) {
    console.log("mongo Db conection successfull");
});
//mongo on error emit
mongoose.connection.on('error', function (err) {
    console.log("MongoDB Error: ", err);
});
//mongo on dissconnection emit
mongoose.connection.on('disconnected', function () {
    console.log("mongodb disconnected and trying for reconnect");
});
//===========================Connect to MongoDB==========================
server.listen(app.get('port'), function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log("Server is running at " + app.get('host') + ":" + app.get('port'));
    }
});


server.timeout = 5000000;
