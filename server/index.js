const express = require('express')
const mongoose = require('mongoose')
const Movie = require('./models/movie')

const PORT = process.env.PORT || 3001

const URL = "mongodb://0.0.0.0:27017/moviebox"

const app = express();
app.use(express.json());

mongoose
    .connect(URL)
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



