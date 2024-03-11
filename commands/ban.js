module.exports = {
	name: 'ban',
    description: 'Banowanko permanentne',
    args: true,
    usage: '<IDużytkownika>',
    cooldown: 1,
    guildOnly: true,
    permissions: ['BAN_MEMBERS'],
	execute(message, args) {
        if (!this.permissions.every(permission => message.member.hasPermission(permission))) {
            message.react('❌');
            return;
        }

        const user = args[0];

        if (user != parseInt(args[0],10)) {
            message.channel.send('Proszę podać poprawne ID!');
            return;
        }

        if (!user.bannable != true) {
            message.channel.send('Nie można zbanować <@user>!');
            return;
        }

        message.guild.members.ban(user).catch(error => {
            message.channel.send(`Coś poszło nie tak: ${error.message}`);
        });

        message.react('✅');
        message.channel.send(`Zbanowanko <@${user}>!`);
    },
}