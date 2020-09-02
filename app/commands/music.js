const ytdl = require('ytdl-core');

global.VoiceConnections = new Map();
global.SongDispatcher = new Map();

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

async function play(guild, song, number = 0) {
  const playlist = await db.collection('playlists').findOne({ guild: guild.id });
  if (!song) {
    log.info('No songs to play, leaving voice.');
    guild.channels.cache.get(playlist.voiceChannel).leave();
    VoiceConnections.delete(guild.id);
    return;
  }
  const connection = VoiceConnections.get(guild.id);

  log.info('Playing song', song);

  const dispatcher = connection
    .play(ytdl(song.url, { filter: 'audioonly' }))
    .on('finish', async () => {
      log.info('Changing song');
      const collection = db.collection('playlists');
      const pl = await collection.findOne({ guild: guild.id });

      number += 1;
      log.info(pl.songs[number], number);

      play(guild, pl.songs[number], number);
    })
    .on('error', (error) => log.error(error));

  log.info('setting voice volume');
  dispatcher.setVolumeLogarithmic(5 / 5);

  SongDispatcher.set(guild.id, dispatcher);

  const channel = client.channels.cache.get(playlist.textChannel);

  // log.info('txt channel', channel);

  // .send(`🎶 Start playing: **${song.title}**`);
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
      play(msg.guild, playlist.songs[0]);
    } catch (err) {
      log.error('Unable to connect to voice', err);
      return msg.channel.send('Error? Voice..play idk', err);
    }
  } else {
    log.info('Existing voice connection found.');
    play(msg.guild, playlist.songs[0]);
  }
};

function skip(msg) {
  log.info('User is skipping this song.');
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      'You have to be in a voice channel to skip songs.',
    );
  }

  const dispatcher = SongDispatcher.get(msg.guild.id);
  if (!dispatcher) return msg.channel.send('There is no song that I could skip!');
  dispatcher.end();
}

async function stop(msg) {
  log.info('User is stopping the music.');
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      'You have to be in a voice channel to stop the music!',
    );
  }

  const playlist = await db.collection('playlists').findOne({ guild: msg.guild.id });
  const dispatcher = SongDispatcher.get(msg.guild.id);
  if (dispatcher) dispatcher.end();
  // Bot needs to leave the voice channel
  msg.guild.channels.cache.get(playlist.voiceChannel).leave();
  VoiceConnections.delete(msg.guild.id);
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
  clearPlaylist: {
    triggers: [
      /clear playlist|clear music/i,
    ],
    help: 'Deelte all songs from the playlist',
    func: async (msg) => {
      const collection = db.collection('playlists');
      await collection.updateOne({ guild: msg.guild.id }, { $set: { songs: [] } });

      msg.reply('Deleted');
    },
  },
};
