import {randomItemFromArray} from "../utils.js";
import {CONFIRM} from "./generic.js";
import {counting, random} from "../numbers.js";
import {MessageEmbed} from "discord.js";
import {random as randomInt, randomFailChance} from "../numbers.js";
import {searchForMovie,getMovieById} from "../constants/api.js";

export const MOVIES = {
    addMovie: {
        triggers: [
            /add movie|add mov/,
            /add normie movie/
        ],
        help: "",
        func: (msg) => {

            let content  = msg.content.split(" ");
            content.splice(0,2).join(" ");

            let isNormie = false;

            const resultCrazy = msg.content.replace(MOVIES.addMovie.triggers[0], "").trim();
            const resultNormie = msg.content.replace(MOVIES.addMovie.triggers[1], "").trim();

            if(MOVIES.addMovie.triggers[1].test(msg.content.toLowerCase()) === true) isNormie = true;


            const result = db.get('movies')
                .push({ title: (isNormie) ? resultNormie : resultCrazy, watched: false, isNormie })
                .write();

            msg.reply(`${randomItemFromArray(CONFIRM)}, added ${content.join(" ")}`)
        }
    },
    getMovies: {
        triggers: [
            /get movies|get movie list/
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

            const watched = MOVIES.toggleWatched.triggers[0];
            const unWatched = MOVIES.toggleWatched.triggers[1];
            let isWatched = false;

            if(watched.test(msg.content.toLowerCase()) === true) isWatched = true;



            const resultWatched = msg.content.replace(watched, "").trim();
            const resultUnWatched = msg.content.replace(unWatched, "").trim();

            console.log(resultUnWatched, resultWatched);

            const cleanWatched = (isWatched) ? resultWatched : resultUnWatched;

            console.log(isWatched, cleanWatched)

            db.get('movies')
              .find({ title: cleanWatched.trim() })
              .assign({ watched: isWatched})
              .write();

            msg.reply(`${isWatched ? "Awwwwwwww yissssssssss!! we" : "Na, we haven't" } saw ${cleanWatched}`)

        }
    },
    getMovieMetaData: {
        triggers: [
            /get movie deets|get movie details|get info on/
        ],
        help: "",
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
            /^<@([^>]+)> pick a movie/,
            /^<@([^>]+)> pick movie/
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
        .setFooter('HessBot the best Bot', client.user.displayAvatarURL());

    msg.channel.send(movieEmbed);
}
