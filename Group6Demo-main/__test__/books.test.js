const chai =require('chai');
const chaiHttp =require ('chai-http');
const server=   require('../index');

// Configure server
chai.use(chaiHttp);
chai.should();


describe('books', () => {
    //get
    it("should get all books list", (done) => {
      chai.request(server)
        .get('/book_form2')      
        .redirects(0)
        .end((err, res) => {
          done();
        });
    });
    //create
    it("should add book", (done) => {
        chai.request(server)
          .post('/books')       
           .redirects(301)
          .end((err, res) => {
            done();
          });
      });
    //update
    it("should update book", (done) => {
        chai.request(server)
          .put('/books/:isbn')
          .redirects(301)
          .end((err, res) => {
            done();
          });
      });
  //delete
  it("should delete book", (done) => {
    chai.request(server)
      .delete('/books/:isbn')
        .redirects(301)
      .end((err, res) => {
        done();
      });
  });

});


