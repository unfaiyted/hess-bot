import {MEMES_SUBS, AWW_SUBS} from "./app.constants.js";
import{MOVIE_DB_API_V3} from "./secret.js";
import fetch from "node-fetch";
import {isURLImage, randomItemFromArray} from "../utils.js";



export const API = {
    MOVIEDB: "https://api.themoviedb.org/3/",
    REDDIT: "'https://www.reddit.com",
};


export  const getPictureFromReddit = (type, index = 0) => {


    const sub =  randomItemFromArray((type === "meme") ? MEMES_SUBS: AWW_SUBS);
    return fetch('https://www.reddit.com/r/' + sub + '.json')
        .then(res => res.json())
        .then(res => res.data.children)
        .then(res => res.filter(post => isURLImage(post.data.url))
            .map(post => ({
                author: post.data.author,
                link: post.data.url,
                sub: post.data.subreddit_name_prefixed,
                redditLink: post.data.permalink,
                title: post.data.title,
            })))
};



//https://api.themoviedb.org/3/search/movie?api_key=xsdfasdfasdf&language=en-US&query=Movie&page=1&include_adult=true&year=2002

export const searchForMovie = (search) => {

    const { searchString, yearString} = parseSearch(search);

    const fetchString = `${API.MOVIEDB}search/movie?api_key=${MOVIE_DB_API_V3}&language=en-US${searchString}&include_adult=true${yearString}`;

    console.log(fetchString);

    return fetch(fetchString)
        .then(res => res.json())
        .then(res => res.results)
            // .map(movie => ({
            //     id: movie.id,
            //     title: movie.title,
            //     overview: movie.overview,
            //     poster: movie.poster_path,
            //     release_date: movie.release_date,
            //     vote_average: movie.vote_average
            // }));

};


export const getMovieById = (id) => {
    console.log("movie id",id)
    const fetchString = `${API.MOVIEDB}movie/${id}?api_key=${MOVIE_DB_API_V3}&language=en-US`;
    console.log(fetchString);
    return fetch(fetchString)
        .then(res => res.json())
};


const parseSearch = (string) => {

    const regEx = /\d{4}\b$/;
    const year = string.match(regEx);

    console.log(year)

    const search = string.replace(regEx, "").trim();

    return {
        searchString: `&query=${search}`,
        yearString: (year) ? `&year=${year[0]}` : ""
    }
};

