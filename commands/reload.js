const { ownerId } = require('../owners.json');
module.exports = {
	name: 'reload',
    description: 'Przeładowanko komendy',
    args: true,
    usage: '<nazwaKomendy>',
    cooldown: 1,
    guildOnly: false,
    permissions: ['OWNER'],
	execute(message, args) {
        if ( !ownerId.includes(message.author.id)) {
            message.react('❌');
            return;
        };

		const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
	        || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`Nie ma komendy o takiej nazwie lub aliasie \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`\`${command.name}\` przeładowanko!`);
        } catch (error) {
            console.log(error);
            message.channel.send(`O kurcze potężne błędzisko podczas przeładowanka \`${command.name}\`:\n\`${error.message}\``);
        }
	},
};