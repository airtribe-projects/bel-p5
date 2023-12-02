const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

before((done) => {
    try {
        mongoose.connect("mongodb://localhost:27017/usersTestDB", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("connected to the db");
        done();
    } catch (err) {
        console.log("error connecting to the db");
        done();
    }
});

beforeEach((done) => {
    console.log('Running before each test');
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

afterEach((done) => {
    console.log('Running after each test');
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

after((done) => {
    console.log('Disconnecting the database');
    mongoose.disconnect();
    done();
});