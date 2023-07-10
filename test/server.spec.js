// Imports the server.js file to be tested.
const server = require("../src/server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
const { name } = require("body-parser");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;


describe('valid post request', function() {
    it('should have sent correct data, status 200', function(done) {
      chai
        .request(server)
        .post("/main")
        .send({
        artist_name: "TestArtist", 
        artist_img: "TestImage",
        artist_genre: "TestGenre",
        artist_country: "TestCountry",
        artist_biography: "TestBiography"})

        .end((err, res) => {
            expect(res.status.should.equal(200))
            expect(res.body.should.have.property("artist_name").equals("TestArtist"))
            expect(res.body.should.have.property("artist_img").equals("TestImage"))
            expect(res.body.should.have.property("artist_genre").equals("TestGenre"))
            expect(res.body.should.have.property("artist_country").equals("TestCountry"))
            expect(res.body.should.have.property("artist_biography").equals("TestBiography"))
          done();
    });
  });
});

describe('post request empty string', function() {
    it('should have posted empty strings as input', function(done) {
      chai
        .request(server)
        .post("/main")
        .send({
        artist_name: "", 
        artist_img: "",
        artist_genre: "",
        artist_country: "",
        artist_biography: ""})

        .end((err, res) => {
            expect(res.status.should.equal(200))
            expect(res.body.should.have.property("artist_name").equals(''))
            expect(res.body.should.have.property("artist_img").equals(''))
            expect(res.body.should.have.property("artist_genre").equals(''))
            expect(res.body.should.have.property("artist_country").equals(''))
            expect(res.body.should.have.property("artist_biography").equals(''))
          done();
    });
  });
});