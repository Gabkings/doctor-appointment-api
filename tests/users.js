const mocha = require('mocha')

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = require('should');
const server = require('../server');
const { loginWithDefaultUser, cleanExceptDefaultUser } = require('./common.test');
const { doesNotThrow } = require('should');

// const request = require("supertest")(server);


chai.use(chaiHttp)

//assertion style
chai.should();

describe("POST /api/user/register", () => {
    it("It should POST a new user account", (done) => {
        const user1 = {
            name: "Test User2",
            email: "gabworks51a@gmail.com",
            password: "123a456"
        };
        chai.request(server)
            .post("/api/user/register")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('User created successfully');
                response.body.should.have.property('success').eq(true);

            })
        done();
    });

    it("It should not POST a new user account twice", (done) => {
        const user1 = {
            name: "Test User1",
            email: "gabworks51@gmail.com",
            password: "123456"
        };
        chai.request(server)
            .post("/api/user/register")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('User already exists');
                response.body.should.have.property('success').eq(false);

            })
        done();
    });

})


describe("POST /api/user/login", () => {
    it("It should login a user", (done) => {
        const user1 = {
            email: "gabworks51@gmail.com",
            password: "123456"
        };
        chai.request(server)
            .post("/api/user/login")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Login successful');
                response.body.should.have.property('success').eq(true);

            })
        done();
    });

    it("It should not login a user who does not exist", (done) => {
        const user1 = {
            email: "gabworks51www@gmail.com",
            password: "123456"
        };
        chai.request(server)
            .post("/api/user/login")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('User does not exist');
                response.body.should.have.property('success').eq(false);

            })
        done();
    });

    it("It should not login a user if password is wrong", (done) => {
        const user1 = {
            email: "gabworks51@gmail.com",
            password: "12345aaaa6"
        };
        chai.request(server)
            .post("/api/user/login")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Password is incorrect');
                response.body.should.have.property('success').eq(false);

            })
        done();
    });

})

describe("Test Users Authenticated requests", () => {
    let token = ''
    before(async() => {
        await request.post("/api/user/login")
            .send({ email: "gabworks51@gmail.com", password: "123456" }).then(resp1 => {
                console.log(resp1._body.data)
                token = resp1._body.data
            })

    })




    it("should retrieve the token", () => {
        console.log('Token ' + token)
        return cleanExceptDefaultUser().then(res => {
            return loginWithDefaultUser().then(res, done => {
                res.success.should.be.true;
                res.data.should.not.be.empty;
                done()
            })
        });

    });


    it("Get all approved doctors", function(done) {
        chai.request(server)
            .set("Authorization", "Bearer " + token) //set the header first
            .get("/get-all-approved-doctors") //then get the data
            .end(function(err, res) {
                res.body.success.should.be.true;
                done();
            });
    });

    it("It should GET a user info by ID", (done) => {
        const userId = { userId: '63b978942416d973244a9881' };
        chai.request(server)

        .post("/api/user/get-user-info-by-id")
            .send(userId)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
            });
        done();
    });


    it("It should test appointment booking", (done) => {
        const data = {
            status: "pending",
            date: "11-12-2022",
            time: "10-11"
        };
        chai.request(server)
            .set("Authorization", "Bearer " + token)
            .post("/api/user/book-appointment")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Appointment booked successfully');
                response.body.should.have.property('success').eq(true);
            })
        done();
    });

    it("It should test appointment booking not success", (done) => {
        const data = {
            status: "pending",
            date: "11-2022",
            time: "101"
        };
        chai.request(server)
            .set("Authorization", "Bearer " + token)
            .post("/api/user/book-appointment")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Error booking appointment');
                response.body.should.have.property('success').eq(false);
            })
        done();
    });

    it("It should test checking if appoint booking is available", (done) => {
        const data = {
            date: "11-12-2022",
            time: "10:10"
        };
        chai.request(server)
            .set("Authorization", "Bearer " + token)
            .post("/api/user/check-booking-avilability")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Appointments available');
                response.body.should.have.property('success').eq(true);
            })
        done();
    });


    it("It should test error checking if appoint booking is available while using wrong parameters", (done) => {
        const data = {
            date: "11-122022",
            time: "10:10"
        };
        chai.request(server)
            .set("Authorization", "Bearer " + token)
            .post("/api/user/check-booking-avilability")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Error checking booking appointment');
                response.body.should.have.property('success').eq(false);
            })
        done();
    });

    it("It should test appoint booking is not available", (done) => {
        const data = {
            date: "11-12-2022",
            time: "10:10"
        };
        chai.request(server)
            .set("Authorization", "Bearer " + token)
            .post("/api/user/check-booking-avilability")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Appointments not available');
                response.body.should.have.property('success').eq(false);
            })
        done();
    });

    it("It should test getting apointments made by user", (done) => {
        user1 = { userId: "63b978942416d973244a9881" }
        chai.request(server)
            .set("Authorization", "Bearer " + token)
            .get("/api/user/get-appointments-by-user-id")
            .send(user1)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.should.have.property('success').eq(true);
            })
        done();
    });

})