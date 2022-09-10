const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
dotenv.config({ path: 'config.env' })

// Connect to the database
mongoose.connect(process.env.DB_URL).then((connection) => {
    console.log(`Database connection established: ${connection.connection.host}`)
}).catch((err) => {
    console.error(err)
    process.exit(1)
})

// App configuration
const app = express();
const PORT = process.env.PORT

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
}

app.use('/', (req, res) => {
    res.send('Hello World')
})


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})