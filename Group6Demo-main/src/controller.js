const bcrypt = require('bcrypt');
const { redirect } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const pool = require('./dbconfig')

//Functions
async function profile(req, res) {
    res.render('profile')
}

async function loginCheck(req, res) {
    pool.query(`SELECT EXISTS(SELECT * FROM USERS WHERE USERNAME='${req.body.username}')`, (err, exists_result) => {
        if (exists_result.rows[0].exists == true) {
            pool.query(`SELECT PASSWORD FROM USERS WHERE USERNAME='${req.body.username}'`, (err, result) => {
                if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
                    const test_user = { name: req.body.username }
                    const accessToken = jwt.sign(test_user, process.env.ACCESS_TOKEN_SECRET);
                    res.cookie('authorization', accessToken);
                    res.redirect('/book_form3');
                } else {
                    req.flash('error_messages', "Please enter valid password or username!");
                    res.redirect('/');
                }
            })
        } else {
            req.flash('error_messages', "Please enter valid password or username!");
            res.redirect('/');
        }
    })
}

async function superLoginCheck(req, res) {
    pool.query(`SELECT EXISTS(SELECT * FROM USERS WHERE USERNAME='${req.body.username}' AND SUPERUSER = 'super')`, (err, exists_result) => {
        if (exists_result.rows[0].exists == true) {
            pool.query(`SELECT PASSWORD FROM USERS WHERE USERNAME='${req.body.username}'`, (err, result) => {
                if (req.body.password == result.rows[0].password) {
                    const test_user = { name: req.body.username }
                    const accessToken = jwt.sign(test_user, process.env.ACCESS_TOKEN_SECRET);
                    res.cookie('authorization', accessToken);
                    pool.query('SELECT * FROM books', (err, books_results) => {
                        res.render('indexAdmin', {
                            bookArr: books_results.rows
                        })
                    })
                } else {
                    req.flash('error_messages', "Please enter valid password or username!");
                    res.redirect('/');
                }
            })
        } else {
            req.flash('error_messages', "Please enter valid password or username!");
            res.redirect('/');
        }
    })
}

async function catalog(req, res) {
    var filtered = false
    pool.query('SELECT * FROM books', (err, books_results) => {
        res.render('read', {
            bookArr: books_results.rows,
            filtered: filtered
        })
    })
}


async function catalogSearch(req, res) {
    console.log('Checking Catalog')
    var value = req.query['search catalog']
    var value1 = req.query['search dropdown']
    var filtered = true
    console.log(value)
    console.log(value1)
    pool.query(`SELECT * FROM books WHERE ${value1} ILIKE '%${value}%' `, (err, books_results) => {
        pool.query('SELECT DISTINCT GENRE FROM BOOKS', (err, genre_results) => {
            res.render('read', {
                bookArr: books_results.rows,
                genreArr: genre_results.rows,
                filtered: filtered
            })
        })
    })
}


// filters through book catalog by genre
async function catalogFilter(req, res) {
    var value = req.query['filter dropdown']
    var filtered = true
    pool.query(`SELECT * FROM books WHERE genre = '${value}'`, (err, books_results) => {
        pool.query('SELECT DISTINCT GENRE FROM BOOKS', (err, genre_results) => {
            res.render('read', {
                bookArr: books_results.rows,
                genreArr: genre_results.rows,
                filtered: filtered
            })
        })
    })
}

async function home(req, res) {
    res.render('index')
}

async function readList(req, res) {
    var filtered = false
    pool.query(`SELECT * FROM BOOKS WHERE ISBN IN (SELECT ISBN FROM LISTS WHERE USERNAME = '${req.test_user.name}' AND FLAG = 'READ')`, (err, books_results) => {
        res.render('Read_List', {
            readBookArr: books_results.rows,
            filtered: filtered
        })
    })
}

async function userMadeList(req, res) {
    var value = req.query['user dropdown']
    var value1 = req.query['search userList']
    var value2 = req.query['search dropdown']
    var filtered = true
    console.log(value)
    console.log(value1)
    console.log(value2)
    pool.query(`SELECT * FROM (SELECT * FROM BOOKS WHERE ISBN IN (SELECT ISBN FROM LISTS WHERE USERNAME = '${req.test_user.name}' AND FLAG = '${value}')) AS SOMETHING WHERE ${value2} ILIKE '%${value1}%'`, (err, books_results) => {
        pool.query('SELECT DISTINCT GENRE FROM BOOKS', (err, genre_results) => {
            res.render('Want_To_Read', {
                readBookArr: books_results.rows,
                genreArr: genre_results.rows,
                filtered: filtered
            })
        })
    })
}

// filters through user made lists by genre
async function userFilter(req, res) {
    var value = req.query['filter dropdown']
    var value2 = req.query['user dropdown']
    var filtered = true
    pool.query(`SELECT * FROM (SELECT * FROM BOOKS WHERE ISBN IN (SELECT ISBN FROM LISTS WHERE USERNAME = '${req.test_user.name}' AND FLAG = '${value2}')) AS SOMETHING WHERE GENRE = '${value}'`, (err, books_results) => {
        pool.query('SELECT DISTINCT GENRE FROM BOOKS', (err, genre_results) => {
            res.render('Want_To_Read', {
                readBookArr: books_results.rows,
                genreArr: genre_results.rows,
                filtered: filtered
            })
        })
    })
}

async function userDispList(req, res) {
    //console.log('here I am')
    var filtered = true
    pool.query(`SELECT * FROM BOOKS WHERE ISBN IN (SELECT ISBN FROM LISTS WHERE USERNAME = '${req.test_user.name}' AND FLAG = 'WANT')`, (err, books_results) => {
        pool.query('SELECT DISTINCT GENRE FROM BOOKS', (err, genre_results) => {
            res.render('Want_To_Read', {
                readBookArr: books_results.rows,
                genreArr: genre_results.rows,
                filtered: filtered
            })
        })
    })
}

async function newUser(req, res) {
    const hashedpw = bcrypt.hashSync(req.body.password, 10);
    pool.query(`SELECT EXISTS(SELECT * FROM users WHERE username ='${req.body.username}')`, (err, exists_result) => {
        if (exists_result.rows[0].exists == true) {
            req.flash('error_messages', "Username already exists!");
            res.redirect('/new');
        } else {
            pool.query(`INSERT INTO users (username, password, superuser) 
            VALUES ('${req.body.username}', '${hashedpw}', 'regular')`, (err, result) => {
                res.redirect('/')
            })
        }
    })
}

async function getNewUser(req, res) {
    res.render('new_account')
}

async function superLogin(req, res) {
    res.render('loginAdmin')
}

async function addRead(req, res) {
    console.log("reached inside of the '/add_to_Read/:isbn'")
    pool.query(`INSERT INTO LISTS VALUES ('${req.params["isbn"]}', 'READ', '${req.test_user.name}')`, (err, result) => {
        console.log(`INSERT INTO LISTS VALUES ('${req.params["isbn"]}', 'READ', '${req.test_user.name}')`)
        console.log(result)
        res.redirect('/book_form2')
    })
}

async function addWant(req, res) {
    console.log("reached inside of the '/add_to_Read/:isbn'")
    pool.query(`INSERT INTO LISTS VALUES ('${req.params["isbn"]}', 'WANT', '${req.test_user.name}')`, (err, result) => {
        console.log(`INSERT INTO LISTS VALUES ('${req.params["isbn"]}', 'WANT', '${req.test_user.name}')`)
        console.log(result)
        res.redirect('/book_form2')
    })
}

async function test_add(req, res) {
    console.log("Posted");
    var isbn_test = req.body.bookItemCheck;
    var btn_val = req.body.btn;
    console.log(btn_val);
    console.log(isbn_test);
    if (isbn_test) {
        isbn_test.forEach(element => {
            pool.query(`INSERT INTO LISTS VALUES ('${element}', '${btn_val}', '${req.test_user.name}')`, (err, result) => {
                console.log(`INSERT INTO LISTS VALUES ('${element}', '${btn_val}', '${req.test_user.name}')`)
            })
        });
        res.redirect('/book_form2')
    } else {
        res.redirect('/book_form2');
    }
}

async function deleteBook(req, res) {
    const isbn = req.params["isbn"];
    pool.query(`DELETE FROM LISTS WHERE isbn = '${isbn}'`, (err, result) => {
        console.log(err)
        res.redirect('/book_form5')
    })
}

async function deleteUser(req, res) {
    pool.query(`DELETE FROM LISTS WHERE USERNAME = '${req.test_user.name}'`, (err, result1) => {
        pool.query(`DELETE FROM USERS WHERE USERNAME = '${req.test_user.name}'`, (err, result2) => {
            res.redirect(301, '/')
        })
    })
}

async function createBook(req, res) {
    res.render('create')
}

async function adminCreate(req, res) {
    pool.query(`SELECT EXISTS(SELECT isbn FROM BOOKS WHERE ISBN = '${req.body.isbn}')`, (err, exists_result) => {
        if (exists_result.rows[0].exists == true) {
            req.flash('error_messages', "Book with ISBN Already Exists");
            res.render('create');
        } else {
            pool.query(`INSERT INTO BOOKS VALUES ('${req.body.isbn}', '${req.body.author}', '${req.body.genre}', '${req.body.title}')`, (err, result) => {
                res.redirect('/adminPage')
            })
        }
    })
}

async function adminMenu(req, res) {
    pool.query('SELECT * FROM books', (err, books_results) => {
        res.render('indexAdmin', {
            bookArr: books_results.rows
        })
    })
}

async function update(req, res) {
    console.log(req.params["isbn"])
    pool.query(`SELECT * FROM books WHERE ISBN = '${req.params["isbn"]}'`, (err, books_results) => {
        console.log(books_results)
        res.render('update', {
            book: books_results.rows[0],
            isbn: req.params["isbn"]
        })
    })
}

async function updateListing(req, res) {
    pool.query(`UPDATE BOOKS SET ISBN = '${req.body.isbn}', AUTHOR = '${req.body.author}', GENRE = '${req.body.genre}', TITLE = '${req.body.title}' WHERE ISBN = '${req.params["isbn"]}'`, (err, result) => {
        console.log(req.params['isbn'])
        console.log(err)
        res.redirect('/adminPage')
    })
}

//Admin Function
async function adminRemove(req, res) {
    console.log("Posted");
    var isbn_test = req.body.bookItemCheck;
    var btn_val = req.body.btn;
    console.log(btn_val);
    console.log(isbn_test);
    if (isbn_test) {
        isbn_test.forEach(element => {
            pool.query(`DELETE FROM LISTS WHERE isbn = '${element}'`, (err, result) => {
                pool.query(`DELETE FROM BOOKS WHERE ISBN = '${element}'`, (err, result) => {
                    console.log(`DELETE FROM BOOKS WHERE ISBN = '${element}'`)
                })
            })
        });
        res.redirect('/adminPage')
    } else {
        res.redirect('/adminPage');
    }
}

async function deleteOneBook(req, res) {
    const isbn = req.params["isbn"];
    pool.query(`DELETE FROM LISTS WHERE isbn = '${isbn}'`, (err, result) => {
        pool.query(`DELETE FROM BOOKS WHERE isbn = '${isbn}'`, (err, result) => {
            console.log(err)
            console.log(`DELETE FROM BOOKS WHERE ISBN = '${isbn}'`)
            res.redirect('/adminPage')
        })
    })
}

async function adminSearchBar(req, res) {
    console.log('Checking Catalog')
    var value = req.query['search catalog']
    var value1 = req.query['admin dropdown']
    console.log(value)
    console.log(value1)
    pool.query(`SELECT * FROM books WHERE ${value1} ILIKE '%${value}%' `, (err, books_results) => {
        res.render('indexAdmin', {
            bookArr: books_results.rows
        })
    })
}



//Cookie/Token Authentication
function authenticateToken(req, res, next) {
    const token = req.cookies['authorization'];
    if (token == null) console.log('Token Not Validated');
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, test_user) => {
        if (err) console.log('User doesn\'t have access');
        req.test_user = test_user;
        next();
    })
}

module.exports = {
    profile,
    loginCheck,
    catalog,
    catalogSearch,
    catalogFilter,
    userFilter,
    home,
    readList,
    userDispList,
    userMadeList,
    newUser,
    superLogin,
    superLoginCheck,
    getNewUser,
    addRead,
    addWant,
    deleteBook,
    deleteUser,
    test_add,
    createBook,
    update,
    updateListing,
    adminCreate,
    adminMenu,
    adminRemove,
    deleteOneBook,
    adminSearchBar,
    authenticateToken
};