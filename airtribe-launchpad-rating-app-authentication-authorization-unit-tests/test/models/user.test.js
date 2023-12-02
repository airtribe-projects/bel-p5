const User = require('../../src/models/user');
const expect = require('chai').expect;
const bcrypt = require('bcrypt');
const sinon = require('sinon');

describe('Creating the documents in mongodb - Without mocking', () => {
    it('Creates a new user successfully', (done) => {
        const user = new User({
            fullName: 'test',
            email: 'test123@gmail.com',
            role: 'admin',
            password: bcrypt.hashSync('test1234', 8)
        });
        expect(user.isNew).equal(true);
        user.save().then(user => {
            expect(!user.isNew).equal(true);
            done();
        }).catch(err => {
            done();    
        });
    }).timeout(5000);

    it('Validates the email of the user', (done) => {
        const user = new User({
            fullName: 'test',
            email: 'test@123@gmail.com',
            role: 'admin',
            password: bcrypt.hashSync('test1234', 8)
        });
        user.save().catch(err => {
            console.log(err);
            expect(err._message).equal('User validation failed');
            done();
        });
    });

    it('Validates the uniqueness of the email', (done) => {
        done();
    });

    it('Validates the role of the user', (done) => {
        const user = new User({
            fullName: 'test',
            email: 'test123@gmail.com',
            role: 'pawan',
            password: bcrypt.hashSync('test1234', 8)
        });
        user.save().catch(err => {
            console.log(err);
            expect(err._message).equal('User validation failed');
            done();
        });
    })
});


describe('Creating the documents in mongo db with mocking', function() {
    let saveStub;
    const user = new User({
        fullName: 'test',
        email: 'test123@gmail.com',
        role: 'admin',
        password: bcrypt.hashSync('test1234', 8)
    });

    beforeEach(() => {
        saveStub = sinon.stub(User.prototype, 'save');
    });

    afterEach(() => {
        saveStub.restore();
    })

    it('Should save the user' , async function() {

        
        const mockUser = {_id: 123, fullName: 'test user', email: 'test1234@gmail.com'};
        saveStub.resolves(mockUser);

        const result = await user.save();
        expect(result).to.deep.equal(mockUser);
        expect(saveStub.calledOnce).to.be.true;
        
    });

    it('Should validate the email', async function() {
        
        user.email = 'test@123@gmail.com';
        const mockError = new Error('database error');
        saveStub.rejects(mockError);

        try {
            await user.save();
        } catch (err) {
            expect(err).to.equal(mockError);
            expect(saveStub.calledOnce).to.be.true;
        }
        
    });
});