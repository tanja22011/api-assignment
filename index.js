const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// get json data
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// creating products
const books =
[
    {
        id: 1,
        name: 'Aivokirurgien muistelmat',
        author: 'Juha Hernesniemi',
        published: 2022,
        language: 'Finnish',
        price: 35,
        available: true
    },
    {
        id: 2,
        name: 'Pimeyden sydän',
        author: 'Ilkka Remes',
        published: '2023',
        language: 'Finnish',
        price: 29,
        available: false
    },
    {
        id: 3,
        name: 'One day',
        author: 'David Nicholls',
        published: '2024',
        language: 'English',
        price: 36,
        available: true
    },
    {
        id: 4,
        name: 'Aleksi Suomesta',
        author: 'Tuomas Kyrö',
        published: '2023',
        language: 'Finnish',
        price: 30,
        available: true
    },
    {
        id: 5,
        name: 'Iron Flame',
        author: 'Rebecca Yarros',
        published: '2023',
        language: 'English',
        price: 19,
        available: false
    },
    {
        id: 6,
        name: 'Tritonus',
        author: 'Kjell Westö',
        published: '2021',
        language: 'Swedish',
        price: 15,
        available: true
    },
]

//get all books
app.get('/api-assignment/books', (req,res) => {
    res.json(books);
});

//get one book
app.get('/api-assignment/books/:id',(req,res) => {
    const bookId = Number(req.params.id);

    const book = books.find(books => books.id === bookId);

    if(book)
    {
        res.status(200).json(book);
    }
    else
    {
        res.status(404).json(
            {
                msg:"Book not found"
            }
        )
    } 
});

//Create
app.post('/api-assignment/books', (req,res) =>{

     const lastId = books[books.length-1].id;
     const newId = lastId + 1;
     
     newBook = 
     {
        id: newId,
        name: req.body.name,
        author: req.body.author,
        published: req.body.published,
        languege: req.body.languege,
        price: req.body.price,
        available: req.body.available
     }
 
     books.push(newBook);
     res.location('http://localhost:3000/api-assignment/books/' + newId);
     res.status(201).json(newBook);
 
 });

 //UPDATE
app.patch('/api-assignment/books/:id',(req,res) => {
    const idUpdate = Number(req.params.id);
    const newPrice = req.body.price;
    const newAvailable = req.body.available;

    books.forEach(book => {
        if(book.id === idUpdate)
        {
            book.price = newPrice;
            book.available = newAvailable;
        }
    });

    const book = books.find(book => book.id === idUpdate);
    if (book)
    {
        res.status(200).json(book);
    }
    else{
        res.status(404).json({msg:'Could not find the book'});
    }
    
});

//Delete
app.delete('/api-assignment/books/:id',(req,res) => {
    const bookId = Number(req.params.id);

    const bookIndex = books.findIndex(book => book.id === bookId);

    if(bookIndex !== -1)
    {
        books.splice(bookIndex, 1);
        res.status(200).json({
            id: bookId
        });
    }
    else
    {
        res.status(404).json({
            msg: "Could not find the book"
        });
    }  
});

//handlebars part
app.engine('handlebars',exphbs.engine({
    defaultLayout:'main'
}));

app.set('view engine', 'handlebars');

//books to indexpage
app.get('/', (req,res) =>{
    res.render('index',
    {
       title: "Books",
       books: books
    })
 });

//static files
 app.use(express.static('public'));

 app.use((req,res,next) => {
    res.status(404).send("Sorry, could not find the content");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));