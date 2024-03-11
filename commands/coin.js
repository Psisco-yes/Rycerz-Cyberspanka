module.exports = {
	name: 'coin',
    description: 'Rzut monetą',
    aliases: ['flip'],
    args: false,
    cooldown: 5,
    guildOnly: false,
	execute(message, args) {
        if(Math.random() >= 0.5) message.channel.send("**ORZEŁ**");
        else message.channel.send("**RESZKA**");
    },
}