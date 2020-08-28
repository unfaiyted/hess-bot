import AWS from 'aws-sdk';


/**
 * Using AWS Systems Manager to store Keys
 * You could create a local file with the values if you did not want to use some sort of key store
 *
 */
AWS.config.update({region: 'us-east-2'});
var ssm = new AWS.SSM({region: 'us-east-2'});

/**
 * Grabs a parameter from AWS store, returns the value.
 * @param value
 * @returns {Promise<*>}
 */
const getParam = async (value) => {
    const {Parameter} = await ssm.getParameter({Name: value}).promise();
    return Parameter.Value
};


console.log(process.platform, "platform");

/**
 * Grabs the correct token depending on environement. Specifically win32 is my testing environement
 * TODO: Improve function/ deployment to ensure it has prod vs dev values to be agnostic of env.
 * @type {Promise<*>}
 */
export const TOKEN = (process.platform === "win32") ? getParam('DISCORD_HESSBOT_DEV_TOKEN') : getParam('DISCORD_HESSBOT_TOKEN');

// Secret Keys
export const MOVIE_DB_API_V3 = getParam('MOVIE_DB_API_V3');
export const MOVIE_DB_API_V4 = getParam('MOVIE_DB_API_V4');



export const getConnectionString = async () => {
    const pass = await getParam('RDS_PASSWORD').then(result => result);
    return  `mongodb+srv://unfaiyted:${encodeURIComponent(pass)}@hessbot-cluster.bey2e.mongodb.net/hessDB?retryWrites=true&w=majority`;
};



