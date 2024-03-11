const { prefix, avatarUrl } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Lista komend',
    aliases: ['commands','cmds'],
	usage: '<nazwa komendy>',
    cooldown: 5,
    guildOnly: false,
	execute(message, args) {
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('**Oto lista dostępnych komend:**');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\n*Możesz wysłać \`${prefix}help <nazwa komendy>\`, aby otrzymać więcej inforamacji!*`);

            return message.author.send(data, { split: true })
	            .then(() => {
	            	if (message.channel.type === 'dm') return;
	            	message.reply('wysłałem ci listę, sprawdź swoje DM-y!');
	            })
	            .catch(error => {
	            	console.error(`Nie mogłem DM-nąć ${message.author.tag}.\n`, error);
	            	message.reply('Nie mogłem ci wysłać wiadomości. Czy masz zablokowane DM-y?');
	            });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
        	return message.reply('niepoprawna komenda!');
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#95FFD9')
            .setAuthor('Help', avatarUrl)
            .addField('**Nazwa:**', `${command.name}`, true);

       if (command.aliases) embed.addField(`**Aliasy:**`, `${command.aliases.join(', ')}`);
       if (command.description) embed.addField(`**Opis:**`, `${command.description}`);
       if (command.usage) embed.addField(`**Składnia:**`, `${prefix}${command.name} ${command.usage}`);
       if (command.permissions) embed.addField(`**Permisje:**`, `${command.permissions.join(', ')}`);

       message.channel.send(embed);
	},
};