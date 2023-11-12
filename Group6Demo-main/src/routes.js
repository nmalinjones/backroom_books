const express = require('express');
const router = express.Router();
const controller = require('../src/controller');

// GET profile
router.get('/book_form', controller.profile);

// POST login
router.post('/login_check', controller.loginCheck);

router.post('/super_login_check', controller.superLoginCheck);

// GET books
router.get('/book_form2', controller.authenticateToken, controller.catalog);

//GET search results
router.get('/search', controller.authenticateToken, controller.catalogSearch);

// GET catalog filter results
router.get('/filter', controller.authenticateToken, controller.catalogFilter);

// GET Index
router.get('/book_form3', controller.authenticateToken, controller.home);

// GET read list
router.get('/book_form4', controller.authenticateToken, controller.readList);

// GET user list
router.get('/book_form5', controller.authenticateToken, controller.userDispList);

// GET users list
router.get('/user_list', controller.authenticateToken, controller.userMadeList);

// GET user filter results
router.get('/user_filter', controller.authenticateToken, controller.userFilter)

// POST new user
router.post('/account', controller.authenticateToken, controller.newUser);

// GET new user
router.get('/new', controller.getNewUser);

router.get('/admin', controller.superLogin);

router.post('/create_book', controller.adminCreate);

//Get Create Form
router.get('/addBook', controller.authenticateToken, controller.createBook);

//Get adminIndex
router.get('/adminPage', controller.authenticateToken, controller.adminMenu);

//GET search results
router.get('/adminSearch', controller.authenticateToken, controller.adminSearchBar);

// POST add to read list
router.post('/add_read/:isbn', controller.authenticateToken, controller.addRead);

// POST add to want list
router.post('/add_want/:isbn', controller.authenticateToken, controller.addWant);

//Post to Add Multiple to List
router.post('/adding', controller.authenticateToken, controller.test_add);

// DELETE from read/want list
router.post('/delete_read/:isbn', controller.authenticateToken, controller.deleteBook);

// DELETE from user list
router.post('/delete', controller.authenticateToken, controller.deleteUser);

//DELETE from Book List
router.post('/deleteBooks', controller.authenticateToken, controller.adminRemove);

//DELETE a Single Book from Book List
router.post('/deleteOneBook/:isbn', controller.authenticateToken, controller.deleteOneBook);

router.post('/updateListing/:isbn', controller.updateListing)

router.post('/update/:isbn', controller.update)

module.exports = router;