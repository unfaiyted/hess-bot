import {randomItemFromArray} from "../utils.js";
import {CONFIRM} from "./generic.js";
import {counting, random} from "../numbers.js";
import {MessageEmbed} from "discord.js";
import {random as randomInt, randomFailChance} from "../numbers.js";
import {searchForMovie,getMovieById} from "../constants/api.js";
import {resultPerTrigger} from "../utils.js";

export const MOVIES = {
    addMovie: {
        triggers: [
            /add movie|add mov/i,
            /add normie movie/i
        ],
        help: "Adds movies to the list of movies, has two list types",
        func: (msg) => {
            const strResults = resultPerTrigger(MOVIES.addMovie.triggers, msg.content);
            let isNormie = false;
            if(strResults[1].hasMatch) isNormie = true;

            const title = (isNormie) ? strResults[1].string : strResults[0].string;

            const result = db.get('movies')
                .push({ title, watched: false, isNormie })
                .write();

            msg.reply(`${randomItemFromArray(CONFIRM)}, added ${(isNormie) ? "normie movie" : ""} ${title.trim()}`)
        }
    },
    getMovies: {
        triggers: [
            /get movies|get movie list/i
        ],
        help: "Command sends list of movies in DB",
        func: (msg) => {
            const movies = db.get('movies').value();
            const type = random(0, 4);


            function mapMovie(movie, i) {
                const title = (movie.watched) ? `~~${movie.title}~~` : movie.title;
                return   "\n" +  counting(type, i) + ". " + title
            }


            const crazyMovies =  movies.filter((mov) => !mov.isNormie)
                .map(mapMovie);

            const normieMovies =  movies.filter((mov) => mov.isNormie)
                .map(mapMovie);

            const embed = new MessageEmbed()
                .setColor('#005f20')
                .setTitle('Movies List')
                .setDescription('List of movies to watch')
                .addFields(
                    { name: 'Crazy Movies', value: `${crazyMovies}`, inline: true },
                          {name: "Normie Movies", value: `${normieMovies}`, inline: true}
                )
                .setTimestamp()
                .setFooter('HessBot the best Bot',  client.user.displayAvatarURL());

            msg.channel.send(embed);

        }
    },
    deleteMovies: {
        triggers: [
            /delete movie|del mov|delete that movie|delete the movie/
        ],
        help: "Command will remove a movie from our list",
        func: (msg) => {


            const result = msg.content.replace(MOVIES.deleteMovies.triggers[0],"");
            console.log(result);

            db.get('movies')
               .remove({ title: result.trim() })
               .write();


            msg.reply("Deleted that shizzzzz, I mean probably.")

        }
    },
    toggleWatched: {
        triggers: [
            /watched movie|We watched|we watched|movie watched|we have watched|was watched/,
            /we didnt watch|was not watched|we havent watched|we haven't watched|we have not watched/
        ],
        help: "Command will mark a movie as watched",
        func: (msg) => {

            const strResults = resultPerTrigger(MOVIES.toggleWatched.triggers, msg.content);
            let isWatched = false;
            if(strResults[1].hasMatch) isWatched = true;

            const watched = (isWatched) ? strResults[1].string : strResults[0].string;

            db.get('movies')
              .find({title: watched.trim()})
              .assign({ watched: isWatched})
              .write();

            msg.reply(`${isWatched ? randomItemFromArray(CONFIRM) + " we" : "Na, we haven't" } saw ${watched}`)

        }
    },
    getMovieMetaData: {
        triggers: [
            /get movie deets|get movie details|get info on/
        ],
        help: "Gets data about a given movie you are intersted in watching",
        func:  async (msg) => {

            const result = msg.content.replace(MOVIES.getMovieMetaData.triggers[0],"");

            try {
                const matches = await searchForMovie(result);
                let movieId = (matches[0].id);
               // console.log(matches);

                if (matches.length > 1) {

                    const embed = new MessageEmbed()
                        .setColor('#005f20')
                        .setTitle("Movie Search")
                        .setDescription('Search Resullllttssss')
                        .addFields(
                            {name: 'Movies Found', value: `${createList(matches)}`},
                        )
                        .addFields(
                            {name: 'Next', value: `Reply with number to get full movie deetz`},
                        )
                        .setTimestamp()
                        .setFooter('HessBot the best Bot', client.user.displayAvatarURL());

                    msg.channel.send(embed);

                    msg.channel.awaitMessages(m => m.author.id === msg.author.id,
                        {max: 1, time: 30000}).then(async collected => {

                       const id = parseInt(collected.first().content);
                        movieId = matches[id-1].id;
                        movieEmbed(msg, movieId)

                    })

                }

                if (matches.length === 1) {

                    movieEmbed(msg, movieId)
                }

            }
            catch(e) {
             console.log(e);
                msg.reply("How about...crashing")
            }

        }
    },
    pickRandomMovie: {
        triggers: [
            /^<@([^>]+)> pick a movie/i,
            /^<@([^>]+)> pick movie/i
      ],
        help: "Command will mark a movie as watched",
        func: async (msg) => {
            const movies =  db.get('movies')
                .filter({ watched: false }).value();

            const random = randomItemFromArray(movies);

            const botMsg = await msg.channel.send(`Your movie isssssss....`)

            let i = 3;

            let randomStop = randomInt(-7,-1);

            const interval = setInterval(() => {

                if (i === randomStop) {
                    clearInterval(interval);
                    botMsg.edit(`${randomItemFromArray(CONFIRM)} its **${random.title}**`)


                } else {

                    const fakeInteger = (randomFailChance(.15)) ? randomInt(-100, 20) : i;

                    botMsg.edit(`isssssss in...${fakeInteger}`);
                }

                i--;

            }, 2000)
        }
    }

};


const createList = (movies) => {
  let list = "";
  let i = 1;
  for(const movie of movies) {
      console.log(movie);
      list += `${i}. ${movie.title} - ${movie.release_date}\n`
  }
  return list;
};

const movieEmbed = async (msg, movieId) => {
    msg.channel.send(randomItemFromArray(CONFIRM) + " found it!");

    const movie = await getMovieById(movieId);

    console.log(movie)
    const movieEmbed = new MessageEmbed()
        .setColor('#005f20')
        .setTitle(`${movie.title} - ${movie.release_date.substr(0,4)}`)
        .setURL(`https://www.imdb.com/title/${movie.imdb_id}`)
        .setDescription(movie.tagline)
        .setThumbnail(`https://image.tmdb.org/t/p/w500/${movie.poster_path}`)
        .setImage(`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`)
        .addFields(
            {name: 'Overview', value: movie.overview},
            {name: 'Rating', value: movie.vote_average, inline: true},
            {name: 'Runtime', value: movie.runtime, inline: true}
        )
        .setTimestamp()
        .setFooter('HessBot the bess Bot', client.user.displayAvatarURL());

    msg.channel.send(movieEmbed);
}
