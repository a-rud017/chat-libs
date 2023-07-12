const express = require('express')
const app = express()

require('dotenv').config({path: './config/.env'})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const chatlibs = require('./models/chatlibs')

app.get('/', async (req, res) => {
    try {
        res.render('index.ejs')    
    } 
    catch (error) {
        console.error(error)
    }
})

app.get('/chatlibs/:category', (req, res) => {
    const category = req.params.category
    const chatlib = chatlibs.getRandomChatLib(category)
    res.json({ chatlib })
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})