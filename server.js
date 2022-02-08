const { client, syncAndSeed} = require('./db')

const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/', async(req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM animal');
        const animals = response.rows;
        res.send(`
        <html>
        <head>
            <link rel ="stylesheet" href="/style.css" />
        </head>
        <body>
            <h1>Four Fun Facts about Animals!</h1>
            <div>
            <h2>Animal</h2>
            <h2>
                ${  
                    animals.map (animal => `
                        <a href="/animals/${animal.id}">${animal.name}</a>
                    `).join('')
                }
            </h2>
            </div>
        </body>
        </html>
        `)
    }
    catch (err) {
        next(err);
    } 
})

app.get('/animals/:id', async(req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM animal WHERE id=$1', [req.params.id]);
        const animals = response.rows[0];
        res.send(`
        <html>
        <head>
            <link rel ="stylesheet" href="/style.css" />
        </head>
        <body>
            <h1>Four Fun Facts about Animals!</h1>
            <div>
            <h2><a href='/'>Animal</a> </h2>
            <h2>
                ${animals.name}
            </h2>
            </div>
        </body>
        </html>
        `)
    }
    catch (err) {
        next(err);
    }
})

const port = process.env.PORT || 3000;

const setUp = async() => {
    try {
        await client.connect();
        await syncAndSeed();
        console.log('connected to server!')
        app.listen(port, (req, res) => {
            console.log(`listening on port ${port}`)
        })
    }
    catch(err) {
        console.log(err)
    }
}

setUp();