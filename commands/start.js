const {ownerId} = require('../owners.json');
const {startSh, startMc} = require('../config.json');
const execFile = require('child_process').execFile;
module.exports = {
	name: 'start',
    description: 'Startowańsko programisków',
    args: false,
    cooldown: 5,
    guildOnly: false,
    permissions: ['OWNER'],
	execute(message, args, client) {
        if (!ownerId.includes(message.author.id)) {
            message.react('❌');
            return;
        };

        if (!args.lenght) {
            message.react('✅')
            .then( () => {
                execFile(startSh, function(err, data) {  
                    console.log(err);
                    console.log(data.toString());                       
                });
                client.destroy();
                setTimeout(() => {
                    process.exit(1);
                }, 10);
            });
        }

        if (args[0] == "mc") {
            message.react('✅')
            .then( () => {
                execFile(startMc, function(err, data) {  
                    console.log(err);
                    console.log(data.toString());                       
                });
            });
        }
        
    },
}