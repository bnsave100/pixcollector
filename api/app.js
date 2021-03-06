const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const cors               = require('cors');
const session            = require('express-session');
const mongoose           = require('mongoose');
const Users              = require('./models/users');
const MongoStore         = require('connect-mongo')(session);
const apiV1              = require('./routes/v1/routes.js');
const port               = process.env.PORT || 5000;
const db                 = process.env.MONGO;
const app                = express();

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => { console.log('Database is connected'); },
        (err) => { console.log('Can not connect to the database' + err); }
    );
mongoose.model('Users');

const sessionOptions = {
    resave: false,
    saveUninitialized: true,
    secret: 'collector_secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
};

app.use(cors());
app.use(session(sessionOptions));
app.use('/', express.static(path.join(__dirname, '../ui/dist/ui')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', apiV1);

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../ui/dist/ui', 'index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));