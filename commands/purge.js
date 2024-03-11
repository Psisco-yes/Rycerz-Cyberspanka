module.exports = {
	name: 'purge',
    description: 'Usuwanko wiadomości',
    aliases: ['clear'],
    args: true,
    usage: '<ilość [2-100]>',
    cooldown: 1,
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
	execute(message, args) {
        if (!this.permissions.every(permission => message.member.hasPermission(permission))) {
            message.react('❌');
            return;
        }

        if (isNaN(args[0])) {
            message.channel.send('Argument musi być liczbą!');
            return;
        }

        if(args[0] < 2 || args[0] > 100) {
            message.channel.send('Proszę stosować się do przedziału!');
            return;
        }

        message.react('✅');

        function clear() {
            message.delete().then( async () => {
                const fetched = await message.channel.messages.fetch({limit: args[0]});
            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Błędzisko: ${error}`));
            });
        }
        setTimeout(clear, 2000);
    },
}