const ytdl = require('ytdl-core');

global.VoiceConnections = new Map();

const start = async (msg) => {
  const args = msg.content.split(' ');
  const collection = db.collection('playlists');
  const voiceChannel = msg.member.voice.channel;

  if (!voiceChannel) {
    return msg.channel.send(
      'You need to be in a voice channel to play music!',
    );
  }

  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return msg.channel.send(
      'I need the permissions to join and speak in your voice channel!',
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  const playlist = await collection.findOne({ guild: msg.guild.id });

  if (!playlist) {
    log.info('Playlist not found, will create one');

    const playlistConstruct = {
      guild: msg.guild.id,
      textChannel: msg.channel.id,
      voiceChannel: voiceChannel.id,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    await collection.insertOne(playlistConstruct);
  } else {
    msg.channel.send(`${song.title} has been added to the playlist!`);
  }

  await collection.updateOne({ guild: msg.guild.id }, { $push: { songs: song } });

  connectToVoice(msg, collection);
};

function play(guild, song, collection) {
  const playlist = collection.findOne({ guild: guild.id });
  if (!song) {
    log.info('No songs to play, leaving voice.');
    guild.channels.get(playlist.voiceChannel).leave();
    return;
  }

  const connection = VoiceConnections.get(guild.id);

  log.info('Playing song', song);

  const dispatcher = connection
    .play(ytdl(song.url))
    .on('finish', () => {
      log.info('Changing song');
      const pl = collection.findOne({ guild: guild.id });
      play(guild, pl.songs[0], collection);
    })
    .on('error', (error) => log.error(error));

  log.info('setting voice volume');
  dispatcher.setVolumeLogarithmic(playlist.volume / 5);

  const channel = client.channels.cache.get(playlist.textChannel);

  log.info('txt channel', channel);

  // .send(`Start playing: **${song.title}**`);
}

const connectToVoice = async (msg, collection) => {
  log.info('Checking for voice connection');

  let connection = VoiceConnections.get(msg.guild.id);
  const playlist = await collection.findOne({ guild: msg.guild.id });

  if (!connection) {
    log.info('No connection found');
    try {
      connection = await msg.member.voice.channel.join();
      VoiceConnections.set(msg.guild.id, connection);
      log.info('Connecting to voice channel');
      play(msg.guild, playlist.songs[0], collection);
    } catch (err) {
      log.error('Unable to connect to voice', err);
      return msg.channel.send('Error? Voice..play idk', err);
    }
  } else {
    log.info('Existing voice connection found.');
    play(msg.guild, playlist.songs[0], collection);
  }
};

function skip(msg) {
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      'You have to be in a voice channel to stop the music!',
    );
  }
  // if (!serverQueue) return msg.channel.send('There is no song that I could skip!');
  // serverQueue.connection.dispatcher.end();
}

function stop(msg) {
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      'You have to be in a voice channel to stop the music!',
    );
  }
  // serverQueue.songs = [];
  // serverQueue.connection.dispatcher.end();
}

exports.MUSIC = {
  play: {
    triggers: [
      /play|play song/i,
    ],
    help: 'Tells the bot to start playing music',
    func: start,
  },
  pause: {
    triggers: [
      /pause|pause music/i,
    ],
    help: 'Pauses currently playing music',
    func: (msg) => { msg.reply('Not implemented currently.'); },
  },
  stop: {
    triggers: [
      /stop|stop music/i,
    ],
    help: 'Stops music and removes playlist',
    func: stop,
  },
  skip: {
    triggers: [
      /skip|skip song/i,
    ],
    help: 'Skips current song',
    func: skip,
  },
  addMusic: {
    triggers: [
      /add song|add music/i,
    ],
    help: 'Adds a song to the playlist',
    func: (msg) => {},
  },
  // shuffle: {
  // },
};
