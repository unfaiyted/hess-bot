import {randomItemFromArray} from "../utils.js";
import {CONFIRM} from "./generic.js";
import {counting, random} from "../numbers.js";
import {MessageEmbed} from "discord.js";

export const MOVIES = {
    addMovie: {
        triggers: [
            /add movie|add mov/
        ],
        help: "",
        func: (msg) => {

            let content  = msg.content.split(" ");
            content.splice(0,2).join(" ");

            const result = db.get('movies')
                .push({ title: content.join(" "), watched: false })
                .write();

            msg.reply(`${randomItemFromArray(CONFIRM)}, added ${content.join(" ")}`)
        }
    },
    getMovies: {
        triggers: [
            /get movies|get mov/
        ],
        help: "Command sends list of movies in DB",
        func: (msg) => {
            const movies = db.get('movies').value();
            const type = random(0, 4);

            const mov =  movies.map((movie, i) => {

                const title = (movie.watched) ? `~~${movie.title}~~` : movie.title;

                return   "\n" +  counting(type, i) + ". " + title
            });


            console.log(client)


            const embed = new MessageEmbed()
                .setColor('#005f20')
                .setTitle('Movies List')
                .setDescription('List of movies to watch')
                .addFields(
                    { name: 'Movies List', value: `${mov}` },
                )
                .setTimestamp()
                .setFooter('HessBot the best Bot',  client.user.displayAvatarURL());


            console.log(mov);

            msg.channel.send(embed);


        }
    },
    deleteMovies: {
        triggers: [
            /delete movie|del mov|delete that movie|/
        ],
        help: "Command will remove a movie from our list",
        func: (msg) => {

        }
    },
    setWatched: {
        triggers: [
            /watched movie|we watched|movie watched/
        ],
        help: "Command will mark a movie as watched",
        func: (msg) => {

        }
    }
};
