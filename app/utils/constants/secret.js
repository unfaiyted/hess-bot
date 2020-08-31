const AWS = require('aws-sdk');

/**
 * Using AWS Systems Manager to store Keys
 * You could create a local file with the values if you did not want to use some sort of key store
 *
 */
AWS.config.update({region: 'us-east-2'});
const ssm = new AWS.SSM({region: 'us-east-2'});

/**
 * Grabs a parameter from AWS store, returns the value.
 * @param value
 * @returns {Promise<*>}
 */
const getParam = async (value) => {
    const {Parameter} = await ssm.getParameter({Name: value}).promise();
    return Parameter.Value
};

module.exports = {
    /**
     * Grabs the correct token depending on environment. Specifically win32 is my testing environement
     * TODO: Improve function/ deployment to ensure it has prod vs dev values to be agnostic of env.
     * @type {Promise<*>}
     */
    getConnectionString: async () => {
        try {
            log.info("Getting connection String")
            const pass = await getParam('RDS_PASSWORD').then(result => result);
            const connStr = `mongodb+srv://unfaiyted:${encodeURIComponent(pass)}@hessbot-cluster.bey2e.mongodb.net/hessDB?retryWrites=true&w=majority`;
            log.info("Final connection String", connStr);
            return connStr
        } catch (e) {
            log.error("Issue getting password to database", e)
        }
    },
   TOKEN: (process.platform === "win32") ? getParam('DISCORD_HESSBOT_DEV_TOKEN') : getParam('DISCORD_HESSBOT_TOKEN'),
    // Secret Keys
   MOVIE_DB_API_V3: getParam('MOVIE_DB_API_V3'),
   MOVIE_DB_API_V4: getParam('MOVIE_DB_API_V4'),

}
