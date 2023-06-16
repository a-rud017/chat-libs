const express = require('express')
const app = express()
// const chatlibsRoutes = require('./routes/chatlibs')
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.use('chatlibs', chatlibsRoutes)

app.get('/', async (req, res) => {
    try {
        res.render('index.ejs')    
    } 
    catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})