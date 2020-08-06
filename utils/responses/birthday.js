import moment from 'moment';
import {EMOJIS} from "../constants/app.constants.js";


export const sendBirthdayReacts = (msg) => {

    const str = "its muh bday";

    const emojisToSend = stringToEmojisArray(str);

    for(const emoji of emojisToSend) {
        msg.react(emoji);
    }

    msg.react(EMOJIS.cake);

};



const stringToEmojisArray = (str) => {
    let spacerIndex = 0;
    const maxSpacerIndex = EMOJIS.spacers.length-1;

    const array = str.toLowerCase().split("");

    let emojiArray = [];

    for(const letter of array) {
        console.log(letter)

        if(/[a-z]/.test(letter)) {
            console.log("this is a letter");
            emojiArray.push(EMOJIS.letters[letter])
        }

        if(/[ ]/.test(letter)) {
            console.log("this is a space");
            emojiArray.push(EMOJIS.spacers[spacerIndex]);
            spacerIndex++;

            if(spacerIndex === maxSpacerIndex) spacerIndex = 0;
        }
    }


    return emojiArray;
};

const isBirthdayToday = (birthday) => {
    if (moment().isSame(birthday, "day")) {
      return true;
    }
};


export const bDayCompare = (str) => {
    return str.substring(0, str.length-4) + moment().format('YYYY');
}
