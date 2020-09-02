const { TOKEN } = require('./utils/constants/secret.js');
const Commands = require('./commands/index.js');
const Responses = require('./responses/index.js');
const { randomItemFromArray } = require('./utils/utils.js');
const { CONFIRM } = require('./responses/generic.js');
const connectToDatabase = require('./utils/database.js');

// App Status reporting.
// TODO: Update this to database recording
// Will need status and last time retrieved
const STATUSES = {
  launching: 'launching',
  ready: 'ready',
  error: 'error',
};

/**
 * Main App
 */
class App {
  // Starts app, setup for config
  // No configuration at this time
  constructor(config) {
    this.config = config;
    this.status = STATUSES.launching;
    this.start();
  }

  /**
     * Starts application
     */
  start() {
    // Gets database connection before connecting to Discord Client
    connectToDatabase().then((db) => {
      // Database Object access through application
      global.db = db;

      // Setup application listeners
      this.listen();

      // Gets the token for logging into the bot.
      TOKEN.then((result) => {
        client
          .login(result)
          .then(() => {
            log.info('Client logged in successfully');
            this.status = STATUSES.ready;
          }).catch((e) => {
            log.error('Error connecting client to Discord', e);
            this.status = STATUSES.error;
            process.exit(1);
          });
      });
    });
  }

  listen() {
    log.warn('Loading Bot listeners');

    client.on('ready', () => {
      log.info(`Logged in as ${client.user.tag}!`);
      Commands.log();
    });

    client.on('guildMemberAdd', (member) => {
      // Send the message to a designated channel on a server:
      const channel = member.guild.channels.cache.find((ch) => ch.name === 'general');
      // Do nothing if the channel wasn't found on this server
      if (!channel) return;
      // Send the message, mentioning the member
      channel.send(` ${msg.reply(randomItemFromArray(CONFIRM))} It's ${member}`);
    });

    client.on('message', (msg) => {
      if (msg.author.bot) return;
      log.info(`last message: ${msg.content}`);
      Responses.onMessage(msg);
      Commands.onMessage(msg);
    });

    client.on('messageReactionAdd', (react) => {
      Responses.onReact(react);
    });
  }

  reload(string) {
    client.guilds.cache.map((guild) => {
      // console.warn(guild,"guild");
      const channel = guild.channels.cache.find((channel) => channel.name === 'bot-messages');
      // console.log(channel,"channel");
      if (channel !== undefined) channel.send(string || 'Bots reloaded');
    });
  }

  removeAllListeners() {
    log.info('Removing all Discord bot listeners');
    client.removeAllListeners();
  }

  async once(expectedStatus, action) {
    const interval = await setInterval(() => {
      log.silly(this.status, 'app.status');
      if (expectedStatus === this.status) {
        clearInterval(interval);
        action();
      }
    }, 200);
  }
}

let app;

// This is module hot reloading, only to run in test environment, not for prod.
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    // Reload this module and its dependencies, when they change (optional)
    module.hot.accept();

    // Gets called before reload (optional)
    module.hot.store((stash) => {
      stash.app = app;
    });

    // Gets called after reload, if there was a store (optional)
    module.hot.restore((stash) => {
      app = stash.app;
      app.reload();
    });

    // Replaces class methods and accessors (optional)
    module.hot.patch(App);

    if (app) {
      log.warn('Reload Triggered');
      app.removeAllListeners();
      app.listen();
    }
  }
}

// Launch app
if (!app) {
  app = new App();
}
