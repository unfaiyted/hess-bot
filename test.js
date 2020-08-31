// Scratch Paper

// const regex = /((?<command>add [a]?[n]?)|(?<isEvent>event)|(?<time>at (?<hour>[\d][\d]?)(?<cycle>am|pm) (?<timezone>[a-z]?[a-z]?[a-z]?))|(for))/gi;
//
//
// const STRINGS = [
//     "add a movie event at 5pm CST",
//     "add an event at 5pm CST for Movies",
//     "add a Movie event at 5pm",
//     "add a new movie event at 5pm cst",
//     "add an event",
//     "add event",
//     "add a game event at 10pm cst",
//     "add a game event at 10am cst",
//     "add a game",
//     "add a stupid game event",
//     "event add a",
// ];
//
//
//
// for(const string of STRINGS) {
//    // (regex.exec(string));
//      const matches = (string.matchAll(regex));
//     for(const match of matches) {
//         console.log(match)
//     }
// }

const triggers = [
    /watched movie|We watched|we watched|movie watched|we have watched|was watched|we saw/i,
    /we didnt watch|was not watched|we havent watched|we haven't watched|we have not watched/i
];


export const resultPerTrigger = (triggers, string) => {

    let results = [];

    for(const trigger of triggers) {
        results.push({
            string: string.replace(trigger,"").trim(),
            hasMatch: (trigger.test(string)),
        });
    }

    return results;
};

const results = resultPerTrigger(triggers, "We didnt watch Eraserhead");

let isWatched = false;
if(results[0].hasMatch) isWatched = true;


const movieWatched = (isWatched) ? results[0].string : results[1].string;

console.log(movieWatched, results);
