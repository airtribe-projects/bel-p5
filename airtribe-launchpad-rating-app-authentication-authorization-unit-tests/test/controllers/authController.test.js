process.env.NODE_ENV = 'test';
let chai = require('chai');
const server = require('../../src/index');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('verifies the signup flow with actual mongo db calls', () => {
    let singupBody = {
        fullName: 'test',
        email: 'test123@gmail.com',
        role: 'admin',
        password: 'test1234'
    }
    it('sucessful signup', (done) => {
        chai.request(server).post('/register').send(singupBody).end((err, res) => {
            expect(res.status).equal(200);
            expect(res.body.message).equal('User saved successfully');
            done();
        });
    });

    it('email validation', (done) => {
        singupBody.email = 'test@123@gmail.com';
        chai.request(server).post('/register').send(singupBody).end((err, res) => {
            expect(res.status).equal(500);
            expect(res.body.message._message).equal('User validation failed');
            expect(res.body.message.message).equal('User validation failed: email: test@123@gmail.com is not a valid email!');
            done();
        });
    });

    it('role validation', (done) => {
        done();
    });
});

describe('verifies the signin flow with actual mongodb calls', () => {
    beforeEach((done) => {
        let singupBody = {
            fullName: 'test',
            email: 'test123@gmail.com',
            role: 'admin',
            password: 'test1234'
        }
        chai.request(server).post('/register').send(singupBody).end((err, res) => {
            done();
        });
    });

    it("Successful sign in", (done) => {
        let signinBody = {
            email: 'test123@gmail.com',
            password: 'test1234'
        };
        chai.request(server).post('/login').send(signinBody).end((err, res) => {
            expect(res.status).equal(200);
            expect(res.body.user.email).equal('test123@gmail.com');
            expect(res.body.message).equal('Login Successful');
            expect(res.body).to.have.property('accessToken');
            done();
        });
    });

    it("Invalid password", (done) => {
        let signinBody = {
            email: 'test123@gmail.com',
            password: 'test12345'
        };
        chai.request(server).post('/login').send(signinBody).end((err, res) => {
            expect(res.status).equal(401);
            expect(res.body.message).equal("Invalid Password!");
            expect(res.body.accessToken).to.be.undefined;
            done();
        });
    });

    it("User does not exist", (done) => {
        let signinBody = {
            email: 'pawan123@gmail.com',
            password: 'test12345'
        };
        chai.request(server).post('/login').send(signinBody).end((err, res) => {
            expect(res.status).equal(404);
            expect(res.body.message).equal("User not found");
            expect(res.body.accessToken).to.be.undefined;
            done();
        });
    });
});
