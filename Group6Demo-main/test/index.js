const server = require("../server");
const chai = require('chai')
const expect = require('chai').expect;
const assert = require('chai').assert
const request = require("supertest");
const should = chai.should;
const jwt = require('jsonwebtoken');


chai.should()
let chaiHttp = require('chai-http');
chai.use(chaiHttp)
const newuser = {
    username: "rupen",
    password: "1234"
}

const adminUser = {
    username: "admin"
}

let token = jwt.sign(newuser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5 * 60 * 1000 });
let adminToken = jwt.sign(adminUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5 * 60 * 1000 });

describe('This is for Login USer', function() {
    this.timeout(5000);
    it("login ", (done) => {
        let newuser = {
            username: "abcd",
            password: "abcd"
        }
        console.log("ya user ha", newuser)
        chai.request(server)
            .post("/login_check")
            .send(newuser)
            .end((err, response) => {
                if (err) {
                    console.log("err ", err.message)
                    return done(err)
                }
                //done()
                console.log("response ", response);
            })
        done()
    });

});

describe('Create Acccount Render Page ', function() {
        var app;

        before(function(done) {
            app = server.listen(3000, function(err) {
                if (err) { return done(err) }
                done();
            })
        })
        it("it should render the create account page ", function(done) {
            request(server).get("/new").expect('content-type', /html/)
                .expect(200, function(err, res) {
                    if (err) { return done(err) }
                    done();
                })
        })


        after(function(done) {
            app.close(function() {
                done();
            })
        })
    })
    describe('Create Account' , function(){
        var app;
        this.timeout(5000);
       
        before(function(done){
            app=server.listen(3000,function(err){
                if(err){return done(err)}
                done();
            })
        })  
        

        it("it will create the new user ", function(done){
            request(server).post("/account")
           .send(newuser).end((err,response) => {
               if (err) {
                   console.log(err);
                   return done(err);
               }
               response.should.have.status(302);
               done();
           })
        })
        
       
        after(function(done){
            app.close(function(){
                done();
            })
        })
    })

describe('Profile Page', function() {
    var app;

    before(function(done) {
        app = server.listen(3000, function(err) {
            if (err) { return done(err) }
            done();
        })
    })
    it("Load the profile the Page ", function(done) {
        request(server).get("/book_form").expect('content-type', /html/).end((err, response) => {
            if (err) {
                console.log(err);
                return done();
            }
            response.should.have.status(200);
            done();
        })
    })

    after(function(done) {
        app.close(function() {
            done();
        })
    })
})

describe('Validate Username', function() {
    var app;

    before(function(done) {
        app = server.listen(3000, function(err) {
            if (err) { return done(err) }
            done();
        })
    })

    it("Check User name is string", function(done) {

        assert.typeOf(newuser.username, 'string');
        done();
    });
    after(function(done) {
        app.close(function() {
            done();
        })
    })
})
describe('Validate Password', function() {
        var app;

        before(function(done) {
            app = server.listen(3000, function(err) {
                if (err) { return done(err) }
                done();
            })
        })
        it("Check User Password must be string", function() {
            assert.typeOf(newuser.password, 'string');
            //await done(); 
        });

        after(function(done) {
            app.close(function() {
                done();
            })
        })
    })
   
describe('Valide Password length', function() {
    var app;

    before(function(done) {
        app = server.listen(3000, function(err) {
            if (err) { return done(err) }
            done();
        })
    })

    it("length of passowrd ", function() {
        newuser.should.have.property('password').with.lengthOf(4);

    })
    after(function(done) {
        app.close(function() {
            done();
        })
    })
})

describe('Valide Password length', function() {
    var app;

    before(function(done) {
        app = server.listen(3000, function(err) {
            if (err) { return done(err) }
            done();
        })
    })

    it("length of passowrd ", function() {
        newuser.should.have.property('password').with.lengthOf(4);
    })
    after(function(done) {
        app.close(function() {
            done();
        })
    })
})

describe('Valide Password Type', function() {
    var app;

    before(function(done) {
        app = server.listen(3000, function(err) {
            if (err) { return done(err) }
            done();
        })
    })

    it("length of passowrd ", function() {
        expect(newuser.password).to.be.a('string')
    })
    after(function(done) {
        app.close(function() {
            done();
        })
    })
})


 describe('This is for Search', function() {
     it("Search Catalog ", (done) => {
         chai.request(server)
             .get("/book_form2")
             .set('Cookie', `authorization=${token}`)
             .end((err, response) => {
                 if (err) {
                     console.log("err ", err.message)
                     return done(err)
                 }
                 response.should.have.status(200);
             })
         done()
     });

 });

 describe('This is for home', function() {
     it("home ", (done) => {
         chai.request(server)
             .get("/book_form3")
             .set('Cookie', `authorization=${token}`)
             .end((err, response) => {
                 if (err) {
                     console.log("err ", err.message)
                     return done(err)
                 }
                 response.should.have.status(200);
             })
         done()
     });
 });

 describe('This is for User Display List', function() {
     it("User display list ", (done) => {
         chai.request(server)
             .get("/book_form5")
             .set('Cookie', `authorization=${token}`)
             .end((err, response) => {
                 if (err) {
                     console.log("err ", err.message)
                     return done(err)
                 }
                 response.should.have.status(200);
             })
         done()
     });
 });

 describe('Adding Book', function() {
     it("Add book ", (done) => {
         chai.request(server)
             .get("/addBook")
             .set('Cookie', `authorization=${token}`)
             .end((err, response) => {
                 if (err) {
                     console.log("err ", err.message)
                     return done(err)
                 }
                 response.should.have.status(200);
                 done()
             })
     });
 });

 describe('Rendering admin login page', function() {
     it("Superlogin page ", (done) => {
         chai.request(server)
             .get("/admin")
             .end((err, response) => {
                 if (err) {
                     console.log("err ", err.message)
                     return done(err)
                 }
                 response.should.have.status(200);
             })
         done()
     });
 });

 describe('Rendering admin panel', function() {
     it("Admin panel ", (done) => {
         chai.request(server)
             .get("/adminPage")
             .set('Cookie', `authorization=${adminToken}`)
             .end((err, response) => {
                 if (err) {
                     console.log("err ", err.message)
                     return done(err)
                 }
                 response.should.have.status(200);
             })
         done()
     });
 });

/*describe('Add Button' , function(){
       var app;
       this.timeout(10000)
     
       before(function(done){
           app=server.listen(3000,function(err){
               if(err){return done(err)}
               done();
           })
       })
      it("add USer button ",function(done){
       //    this.timeout(5000);
       const addbutn={
           bookItemCheck:"",
           btn:123
       }
       request(server).post("/adding")
       .send(addbutn).end((err,response) => {
           if (err) {
               console.log(err);
               return done();
           }
           response.should.have.status(201);
           done();
       })
       // done();
      })
    

       after(function(done){
           app.close(function(){
               done();
           })
       })
   })
   */

// describe('This is for Read List', function() {
//     it("Read List ", (done) => {
//         chai.request(server)
//             .get("/book_form4")
//             .set('Cookie', `authorization=${token}`)
//             .end((err, response) => {
//                 if (err) {
//                     console.log("err ", err.message)
//                     return done(err)
//                 }
//                 response.should.have.status(200);
//             })
//         done()
//     });
// });

/*
describe('For Index page' , function(){
    var app;
  
    before(function(done){
        app=server.listen(3000,function(err){
            if(err){return done(err)}
            done();
        })
    })

    it("it should render the page ",function(done){
        request(server).
        get("/")
        .expect('content-type',/html/)
        .expect(200, function(err, res){
            if(err){return done(err)}
            done();
        })
    })

    // it("should respnse in valid Post request ",function(done){
    //     request(server).
    //     post("/")
    //     .expect(200)
    //     .end(done())
    // })
   
    after(function(done){
        app.close(function(){
            done();
        })
    })
})
/*/