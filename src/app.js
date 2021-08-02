const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath =  path.join(__dirname, '../templates/partials');

// Setup handlebars angine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(path.join(publicDirectoryPath)))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Maksu'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Maksu'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        message: 'Help me plz!',
        title: 'Help Page',
        name: 'Maksu'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: "You must provide an address to see weather."
        })   
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error });
        } 
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast:forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('my404',{
        message: 'Help article not found',
        title: 'Help 404',
        name: 'Maksu'
    })
})

app.get('*', (req, res) => {
    res.render('my404',{
        message: 'My 404 page',
        title: '404 page',
        name: 'Maksu'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})