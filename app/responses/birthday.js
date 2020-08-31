const moment = require('moment');
const { EMOJIS } = require('../utils/constants/app.constants.js');
const { FRIENDS } = require('../utils/constants/friends.js');
const { stringToEmojisArray } = require('../utils/string.js');

exports.sendBirthdayReacts = (msg) => {
  // Reacts to Send
  const str = 'its muh bday';

  // Converts String to an Array
  // Reacts must be unique, no repeating characters
  const emojisToSend = stringToEmojisArray(str);

  for (const emoji of emojisToSend) {
    msg.react(emoji);
  }

  // Yum! Cake! Emojis
  msg.react(EMOJIS.cake);
};

const isBirthdayToday = (birthday) => {
  if (moment().isSame(birthday, 'day')) {
    return true;
  }
};

exports.bDayCompare = (str) => str.substring(0, str.length - 4) + moment().format('YYYY');

exports.bDayPrivateMessage = () => {
  const user = client.users.cache.find((user) => user.username === 'MEATY TONES');

  let i = 0;
  const interval = setInterval(() => {
    const BDay = [
      'Its our Birthday !!! OUR BIRTHDAY!!!',
      "We're the very best of people",
      "I'm definitely a person!!! NOT A bot!",
      'its my birthday!!!!!!',
      'aRENT YOU SO HAPPPPPY',
      'dane loves us so much!!!!',
      'WE HAVE THE BEST BIRTHDAYYYYYYY EVAAAHHHHHHHH',
      'Awwwwww Yissss',
      'HAPPY BIRTHDAYYYY TO USSSSS!',
    ];

    if (moment().isSame('2020-08-06T01:00', 'hour')) {
      user.send(BDay[i]);

      if (i === 8) {
        clearInterval(interval);
      }

      i++;
    } else {
      const m = moment('2020-08-06T01:00').diff(moment(), 'minutes');
      // console.log("not yet in ", m);
    }
  }, 2000);
};

exports.sendBirthdayReactsToUser = (msg) => {
  const friendKeys = Object.keys(FRIENDS);

  for (const key of friendKeys) {
    const friend = FRIENDS[key];
    if (friend.username === msg.author.username) {
      const bday = this.bDayCompare(friend.birthday);

      if (moment().isSame(bday, 'day')) {
        this.sendBirthdayReacts(msg);
      } else {
        const m = moment(bday).diff(moment(), 'days');
      }
    }
  }
};
