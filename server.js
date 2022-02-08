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
            <h2>Click below to select a fun fact!</h2>
            <div>
            <ul>
                ${  
                    animals.map (animal => `
                    <ol>
                        <a href="/animals/${animal.id}">${animal.name}</a>
                    </ol>
                    `).join('')
                }
            </ul>
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
        const promises = [
            client.query('SELECT * FROM animal WHERE id=$1', [req.params.id]),
            client.query('SELECT * FROM funFacts WHERE animal_id=$1', [req.params.id])
        ]
        const [animalName, factName] = await Promise.all(promises)
        const animals = animalName.rows[0];
        const facts = factName.rows;
        res.send(`
        <html>
        <head>
            <link rel ="stylesheet" href="/style.css" />
        </head>
        <body>
            <h1><a href="/">More Animals!</a></h1>
            <h2 class="title">
                ${animals.name}
            </h2>
            <div>
            <p>
                ${  
                    facts.map (fact => `
                        ${fact.fact}
                    `).join('')
                }
            </p>
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