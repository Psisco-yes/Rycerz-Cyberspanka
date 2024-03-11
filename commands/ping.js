const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    description: 'Pingowanko',
    args: false,
    guildOnly: true,
    execute(message, args) {
        let ping = Date.now() - message.createdTimestamp + "ms";
        message.channel.send(`:ping_pong: Pong! \`${ping}\``);
    }
}