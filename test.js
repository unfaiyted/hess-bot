// Scratch Paper file
//
// const fetch = require('node-fetch');
// const KEY = require('./app/utils/constants/secret.js').MONKEY_LEARN_API;
//
// global.Headers = fetch.Headers;
//
// const modelId = 'cl_pi3C7JiL';
// const API = `https://api.monkeylearn.com/v3/classifiers/${modelId}/classify/`;
//
// KEY.then((result) => {
//   console.log(result);
//
//   fetch(API, {
//     method: 'post',
//     headers: new Headers({
//       Authorization: `Token ${result}`,
//       'Content-Type': 'application/json',
//     }),
//     body: JSON.stringify({
//       data: ['This is working awesome!', 'watson is a total loser'],
//     }),
//   }).then((r) => r.json())
//     .then((r) => {
//       console.log(r);
//
//       console.log(r[1].classifications);
//     });
// });
