var express = require('express');
var router = express.Router();
var db = require('../models')
var {Book} = db;
var {Op} = require('sequelize');


const createError = require('http-errors');

function asyncHandler(cb){
    return async(req, res, next) => {
      try{
        await cb(req,res,next)
      } catch (error){
        res.status(500).send(error);
      }
    }
  }

/* GET home page. */
router.get('/', async function (req, res, next) {
    const pageNumber = parseInt(req.query["page"]) || 1;
    const searchTerm = req.query["search_key"] || "";
    const books = await db.Book.findAll(
      {order: [['title','ASC']],
      where: {
        [Op.or]: {
        title: {[Op.substring]: searchTerm},
        author: {[Op.substring]: searchTerm},
        genre: {[Op.substring]: searchTerm},
        year: {[Op.substring]: searchTerm}
        }
      },
      limit: 10,
      offset: (pageNumber-1)*10
    });
    const count =  await db.Book.count({
      where: {
        [Op.or]: {
        title: {[Op.substring]: searchTerm},
        author: {[Op.substring]: searchTerm},
        genre: {[Op.substring]: searchTerm},
        year: {[Op.substring]: searchTerm}
        }
    }});
    const pageCount = Math.ceil(count/10);
    res.render('index', { books, searchTerm, pageCount, searchTerm, currentPage: pageNumber });
  });
router.get('/new', async function (req, res, next) {
    const books = await db.Book.findAll({order: [['title','ASC']]});
    res.render('new-book');
  });
router.post('/new', asyncHandler( async(req,res,next) => {
    try{
      const newBook = await Book.create(req.body);
      res.redirect('/');
    }
    catch(error){
      if(error.name === "SequelizeValidationError"){
        const book = Book.build(req.body);
        res.render('new-book',{book, errors: error.errors})
      }
      else throw error;
    }
  }))
  
  
router.get('/:id', async function (req, res, next) {
    const book = await db.Book.findByPk(req.params.id);
    if(book === null)
    {
      return res.render('page-not-found');
    }
    res.render('update-book', { book });
  });
  
router.post('/:id', asyncHandler(async (req,res,next) => {
    const book = await db.Book.findByPk(req.params.id);
    if(book === null)
    {
      return next(createError(404));
    }
    try{
      await book.update(req.body);
    }
    catch(error){
      const oldBook = await db.Book.findByPk(req.params.id)
      if(error.name === 'SequelizeValidationError'){
        res.render('update-book',{ book: oldBook, errors: error.errors})
      }
      else throw error;
    }
    return res.redirect(`/books/${req.params.id}`);

  }))
router.post('/:id/delete', asyncHandler(async (req,res,next) => {
  const book = await db.Book.findByPk(req.params.id);
  if(book === null)
  {
    return next(createError(404));
  }
  
  await book.destroy();
  return res.redirect(`/books`);
}));

module.exports = router;
  