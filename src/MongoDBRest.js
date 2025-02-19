require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://addmin:',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

const bookSchema = new mongoose.Schema({
    id : Number,
    title : String,
    author : String
})

const Book = mongoose.model('Book',bookSchema);

app.post('/books', async(req,res) => {
    const lastBook = await Book.findOne().sort({id : -1});
    const newId = lastBook ? lastBook.id + 1 : 1;
    const book = new Book({
        id : newId,
        title : req.body.title,
        author : req.body.author
    })
    await book.save();
    res.send(book);
})

app.get('/books', async(req,res) =>{
    const books = await Book.find();
    res.send(books);
})

app.get('/books/:id', async(req,res) => {
    const book = await Book.findOne({id : req.params.id});
    res.send(book);
})

app.put('/books/:id', async(req,res) => {
    const book = await Book.findOne({id : req.params.id});
    book.title = req.body.title;
    book.author = req.body.author;
    await book.save();
    res.send(book);
})

app.delete('/books/:id' , async(req,res) =>{
    const result =await Book.deleteOne({id : req.params.id});
    res.send(result);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));