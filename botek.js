'use strict'
const Discord = require('discord.js');
const {prefix, token, avatarUrl, serverId, botId} = require('./config.json');
const anwsers = require('./anwsers.json');
const fs = require('fs');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
let randomAnwsersCooldown = 0;
const link = /d.*i.*s.*c.*o.*r.*d.*(\..*g.*g.*\/.|a.*p.*p.*\..*c.*o.*m.*\/.*i.*n.*v.*i.*t.*e.*\/.|\..*c.*o.*m.*\/.*i.*n.*v.*i.*t.*e.*\/.)/ig;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log('CyberSpanisko G0tuw!');
    const server = client.guilds.resolve(serverId);
    setInterval(() => {
        server.setIcon(avatarUrl);
        client.user.setAvatar(avatarUrl);
        console.log("Awatary updated!");
    }, 21600000);
});
// On message Delete logging
client.on("messageDelete", messageDelete => {
    const botLog = messageDelete.guild.channels.cache.find(channel => channel.name === "bot_log");

    if (messageDelete.content.startsWith(`${prefix}purge`) || messageDelete.channel == botLog) return;

    messageDelete.channel.send(":envelope::fire: Wykryłem usunięcie wiadomości!");

    botLog.send(`Na kanale: ${messageDelete.channel}, usunięto wiadomość.\n${messageDelete.author}: ${messageDelete.content}`);
});

client.on("messageDeleteBulk", messageDeleteBulk => {
    const botLog = messageDeleteBulk.first().guild.channels.cache.find(channel => channel.name === "bot_log");

    if(messageDeleteBulk.first().channel == botLog) return;

    const messages = messageDeleteBulk;
    let outputMessages = [];

    messages.forEach(message => {
        outputMessages.push(`${message.author}: ${message.content}`);
    });
    messageDeleteBulk.first().channel.send(":envelope::fire: Wykryłem usunięcie wielu wiadomości!");

    botLog.send(`Na kanale: ${messageDeleteBulk.first().channel}, usunięto ${messageDeleteBulk.size} wiadomości.\n${outputMessages.reverse().join(`\n`)}`);
});
// end of logging
// discord link detection
client.on('message', message => {
    if(message.content.match(link)) {
        if(message.member.hasPermission('MANAGE_MESSAGES')) return;
        message.delete();
        message.reply(`linki do innych serwerów nie są tu mile widzane.`);
    }
});
//end of detection
//guild related detections
client.on('guildMemberAdd', guildMember => {
    const mainChannel = guildMember.guild.channels.cache.find(channel => channel.name === "ogólny");
    const server = client.guilds.resolve(serverId);
    if (guildMember.guild = server) {
        const role = server.roles.cache.find(role => role.name === "Obywatel");
        guildMember.roles.add(role);
    }
    mainChannel.send(`:door: Do serwerka dobija się ${guildMember.user}!`);
});

client.on('guildMemberRemove', guildMember => {
    const mainChannel = guildMember.guild.channels.cache.find(channel => channel.name === "ogólny");
    const botLog = guildMember.guild.channels.cache.find(channel => channel.name === "bot_log");
    botLog.send(`<@${guildMember.displayName}> opuścił serwer. ID: ${guildMember.id}`);
    mainChannel.send(`:door: Serwerek opuszczonko ${guildMember.displayName} :broken_heart:`);
});
//end of guild stuff
// Random anwsering
client.on('message', message => {
    const trigger = message.content.toLowerCase();
    const now = Date.now();

    if (now < randomAnwsersCooldown) return;

    if (message.author.id == botId) return;

    const index = anwsers.triggers.findIndex(table => table.some(word => {
        let wordReg = new RegExp(`(^| |\\(|\\*|#|<|'|"|\\[|{|,|\\.|\`)${word}($| |\\)|\\*|!|\\?|>|:|;|'|"|\\]|}|,|\\.|\`)`,"igm");
        if(trigger.match(wordReg)) return true;
        else return false;
    }));
    
    if (index === -1) return;
    
    const chance = Math.floor(Math.random() * (100 + 1));

    if (chance < 99.5) return;

    String.prototype.interpolate = function(params) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        return new Function(...names, `return \`${this}\`;`)(...vals);
    }

    randomAnwsersCooldown = now + 10000;
    
    const specialChance = Math.floor(Math.random() * (100 + 1));
    
    const specials = { //specials in anwsers ${specialHere}
        userId: message.author.id,
        dateRan: new Date(now + Math.random() * (new Date(2050, 0, 1) - now)).toLocaleDateString()
    }

    if(specialChance > 99.5) {
        const randomAnwserIndex = Math.floor(Math.random() * (anwsers.anwsersSp[index].length));
        let fallbackDf = "anwsersSp";
        if (!anwsers[fallbackDf][index][randomAnwserIndex]) fallbackDf = "answersDf";
        const result = anwsers[fallbackDf][index][randomAnwserIndex].interpolate(specials);
        message.channel.startTyping();
        message.channel.send(result);
        setTimeout(() => message.channel.stopTyping(), 2000);
        return;
    }

    const randomAnwserIndex = Math.floor(Math.random() * (anwsers.answersDf[index].length));
    if (!anwsers.answersDf[index][randomAnwserIndex]) return;
    const result = anwsers.answersDf[index][randomAnwserIndex].interpolate(specials);
    message.channel.startTyping();
    message.channel.send(result);
    setTimeout(() => message.channel.stopTyping(), 2000);
});
//end of anwsering
//commands handling
client.on('message', message => {
    if(!message.content.startsWith(prefix)) return;
    if (message.author.id == botId) return;

    let args = message.content.slice(prefix.length,message.content.length).split(/\s+/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        return;
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Nie mogę wykonać tutaj tej komendy!');
    }

    if (command.args && !args.length) {
        let reply = `Proszę podać argumenty, ${message.author}!`;

		if (command.usage) {
			reply += `\nSkładnia: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const cooldownAmount = (command.cooldown || 1) * 1000;
    const timestamps = cooldowns.get(command.name);
    
    if (timestamps.has(message.author.id)) {
        
        const expirationTime = timestamps.get(message.author.id);

	    if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
	    	return message.reply(`musisz odczekać ${timeLeft.toFixed(0)}s przed ponownym użyciem \`${command.name}\`.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    timestamps.set(message.author.id, now + cooldownAmount);

    try {
	    command.execute(message, args, client);
    } catch (error) {
    	console.error(error);
	    message.reply('potężne błędzisko!!! D:::');
    }
});
//end of handling
client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(token);