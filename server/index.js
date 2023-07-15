const express = require('express')
const mongoose = require('mongoose')
const Movie = require('./models/movie')

const PORT = process.env.PORT || 3001

const URL = "mongodb+srv://rozelstas:qwerty123@cluster0.tlm43di.mongodb.net/?retryWrites=true&w=majority"

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

mongoose
    .connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`DB connection error: ${err}`))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

const messageErr = (res, error) => {
    res.status(500).json({ error });
}
app.get('/api/movies', (req, res) => {
    Movie
        .find()
        .sort({ title: 1 })
        .then((movies) => {
            res
                .status(200)
                .json(movies)

        })

        .catch(() => messageErr(res, "Something goes wrong..."))
})

app.get('/api/movies/:id', (req, res) => {
    Movie
        .findById(req.params.id)
        .then((movie) => {
            res
                .status(200)
                .json(movie)
        })
})

app.delete('/api/movies/:id', (req, res) => {
    Movie
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res
                .status(201)
                .json(result)
        })
})

app.post('/api/getmovie', (req, res) => { 
    const movie = new Movie((req.body));
    movie
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch(() => messageErr(res, "Something goes wrong..."));
});

app.patch('/api/movies/:id', (req, res) => {
    Movie
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch(() => messageErr(res, "Something goes wrong..."));
});

app.post('/api/movies/del_all', (req, res) => {
    Movie
        .deleteMany({})
        .then((result) => {
            res
                .status(204)
                .json(result)
        })
        .catch(() => messageErr(res, "Something goes wrong..."));
})



