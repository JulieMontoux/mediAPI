const db = require('../db');
const bookRepository = require('../repository/BooksRepository');

const generateETag = (data) => {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookRepository.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await bookRepository.getBookById(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createBook = async (req, res) => {
  const { titre, annee_publication, quantite = 1, auteurs } = req.body;
  try {
    const bookId = await bookRepository.createBook({ titre, annee_publication, quantite, auteurs });
    res.status(201).json({ id: bookId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { titre, annee_publication, auteurs } = req.body;
  try {
    await bookRepository.updateBook(id, { titre, annee_publication, auteurs });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookQuantity = async (req, res) => {
  const { id } = req.params;
  try {
    const { quantiteTotale, quantiteDisponible } = await bookRepository.getBookQuantity(id);
    res.json({ quantiteTotale, quantiteDisponible });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateBookQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantite } = req.body;
  try {
    await bookRepository.updateBookQuantity(id, quantite);
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await bookRepository.deleteBook(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};