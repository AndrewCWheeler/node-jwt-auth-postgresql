const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./server/models');
const Role = db.role;

db.sequelize
    .sync({ force: true })
    .then(() => {
        console.log('Drop and Resync Db');
        initial();
    })
    .catch(err => {
        console.log(err);
    });

function initial() {
    Role.create({
        id: 1,
        name: 'user',
    });

    Role.create({
        id: 2,
        name: 'moderator',
    });

    Role.create({
        id: 3,
        name: 'admin',
    });
}

// For production, just insert these rows manually and use sync() without parameters to avoid dropping data:

// ...
// const app = express();
// app.use(...);

// const db = require("./app/models");

// db.sequelize.sync();
// ...

app.get('/', (req, res) => {
    res.json({ message: 'Backend server working...' });
});

require('./server/routes/auth.routes')(app);
require('./server/routes/user.routes')(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
