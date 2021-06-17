const mongoose = require('mongoose')

const { PORT } = require('./config/app')
const { MONGO_URI, MONGO_OPTIONS } = require('./config/db')
const { createApp } = require('./app')

;(async () => {

    console.log(MONGO_URI)

    await mongoose.connect(MONGO_URI, MONGO_OPTIONS)

    const app = createApp()
    
    app.listen(PORT, () => console.log('http://localhost:' + PORT))
})()