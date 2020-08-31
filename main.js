// App Logger
const Logger = require("tslog").Logger;
global.log = new Logger({
    name: "MainLogger",
    overwriteConsole: true,
    displayDateTime: false,
    displayLoggerName: false,
    displayFilePath: true,
    displayFunctionName: false,
    minLevel: "trace",
    displayTypes: true,
})

// Discord Client
const Discord = require("discord.js");
global.Discord = Discord;
global.client = new Discord.Client();


// Ensure not in prod for hot reloading
if (process.env.NODE_ENV !== "production") {
// Will only hot reload after this
    require('node-hot')
        // Globally configure node-hot (optional)
        .configure({
            // Disable logging (default: false)
            silent: false,

            // Automatically patch all exported classes (default: false)
            patchExports: true,

            // Exclude patterns (default: node_modules)
            exclude: [
                /[\/\\]node_modules[\/\\]/,
                /[\/\\]bower_components[\/\\]/,
                /[\/\\]jspm_packages[\/\\]/
            ]
        });
}

// Main/entry module can't be reloaded, hence the extra file
require('./app/app.js');
