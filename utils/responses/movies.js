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
            /delete movie|del mov|delete that movie/
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
    setWatched: {
        triggers: [
            /watched movie|we watched|movie watched|we have watched|was watched/,
            /we didnt watch|was not watched|we havent watched|we haven't watched|we have not watched/
        ],
        help: "Command will mark a movie as watched",
        func: (msg) => {


            const watched = MOVIES.setWatched.triggers[0];
            const unWatched = MOVIES.setWatched.triggers[1];
            let isWatched = false;

            if(watched.test(msg.content.toLowerCase())) isWatched = true;

            const result = msg.content.replace((isWatched) ? watched : unWatched,"").trim();
            console.log(result);

            db.get('movies')
              .find({ title: result.trim() })
              .assign({ watched: isWatched})
              .write();

            msg.reply(`${isWatched ? "Awwwwwwww yissssssssss!! we" : "Na, we haven't" } watched ${result}`)

        }
    }


};
