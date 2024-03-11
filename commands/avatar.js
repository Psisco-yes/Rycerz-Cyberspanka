const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	description: 'Wyświetla awatar użytkownika',
    aliases: ['pic','av'],
	usage: '<@użytkownik>',
    cooldown: 10,
    guildOnly: true,
	execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle('LINK');
        let imgUrl;
        if (!message.mentions.users.size) {
            imgUrl = message.author.displayAvatarURL({ format: "png", dynamic: true });
            embed.setURL(imgUrl);
            embed.setImage(imgUrl);
            return message.channel.send(embed);
        };

        const userUrl = message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true });
        embed.setURL(userUrl);
        embed.setImage(userUrl);
        
        message.channel.send(embed);
    },
};