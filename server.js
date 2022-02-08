const { client, syncAndSeed} = require('./db')

const express = require('express');
const app = express();

app.get('/', async(req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM animal');
        const species = response.rows;
        res.send(`
        <html>
        <head>
        </head>
        <body>
            <h1>Four Fun Facts about Animals!</h1>
            <div>
            <h2>
                ${
                    species.map (animal => `
                        <a href='/'>${animal.name}</a>
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