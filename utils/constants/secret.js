import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-2'});
var ssm = new AWS.SSM({region: 'us-east-2'});


const getParam = async (value) => {
    const {Parameter} = await ssm.getParameter({Name: value}).promise();
    console.log(Parameter);
    return Parameter.Value
};

export const MOVIE_DB_API_V3 = getParam('MOVIE_DB_API_V3');
export const MOVIE_DB_API_V4 = getParam('MOVIE_DB_API_V4');
export const TOKEN = getParam('DISCORD_HESSBOT_TOKEN');
