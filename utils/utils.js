import fetch from "node-fetch"
import {MEMES_SUBS, VALID_IMG_EXT} from "./constants/app.constants.js";

export const randomItemFromArray = (array) => {
 return array[Math.floor(Math.random()*(array.length))]
};

export const isURLImage = (url) => {

    const urlSplit = url.split("/");
    const fileName = urlSplit[urlSplit.length-1];
    const extension = fileName.split(".");

    return VALID_IMG_EXT.some(ext => ext === extension[1]);
};


export  const getPictureFromReddit = (subReddit, index = 0) => {
    const sub =  randomItemFromArray(MEMES_SUBS);
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

