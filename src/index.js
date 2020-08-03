const botconfig = require("./settings/botconfig.json");
const roles = require("./settings/roles.json");
const memes = require("./settings/memes.json");
const emotes = require("./settings/emotes.json");

const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });

const { token, vote, prefix, join, leave } = botconfig.config;
const { res_dm, pol_votes, pol_toManyArgs } = botconfig.responses;
const { votesplit, votesplit2 } = botconfig.splitters;


bot.login(token);

bot.on("ready", async () => {
    console.log(`At your service`);
    bot.user.setActivity(`type -help for help`);
});

bot.on("message", async message => {

    if (message.author.bot)
        return;

    if (message.channel.type === "dm" && !message.author.bot)
        return message.reply(res_dm);

    const argssingle = message.content.split(" ");

    //for single word commands
    switch (argssingle[0].toLocaleLowerCase()) {
        case `dabs`:
            message.reply(botconfig.dabimg[Math.floor(Math.random() * botconfig.dabimg.length)]);
            return message.delete().catch(console.error);
        case `ping`:
            return message.channel.send(`pong`);
        case join:
            return join_roles(message, argssingle);
        case leave:
            return leave_roles(message, argssingle);
        case vote:
            return voting(message);
        case prefix:
            switch (argssingle[1].toLocaleLowerCase()) {
                case `help`:
                    return message.author.send(res_dm);
                case `serverinfo`:
                    return message.channel.send(await guildInfoEmbed(message));
                case "botinfo":
                    return message.channel.send(await botinfoEmbed());
                default:
                    return;
            }
        default:
            return;
    }
});


/**
 * 
 * @param {message} message 
 * @param {argssingle} argssingle 
 * 
 * @returns {void} void
 */
async function join_roles(message, argssingle) {
    if (argssingle.length <= 1)
        return;

    let args1 = argssingle[1].toLocaleLowerCase();
    let guildRoles = await roles[message.guild.id];

    if (!guildRoles.includes(args1))
        return message.reply(`this role is not supported`);
    let roler = await message.guild.roles.cache.find(r => r.name === args1);

    if (message.member.roles.cache.has(roler.id)) {
        return message.reply(`you allready have that role`);
    } else {
        message.reply(` is ready for ${args1}`);
        return message.member.roles.add(roler).catch(console.error);
    }
}

/**
 * 
 * @param {message} message
 * @param {argssingle} argssingle
 * 
 * @returns {void} void
 */
async function leave_roles(message, argssingle) {
    if (argssingle.length <= 1)
        return;

    let args1 = argssingle[1].toLocaleLowerCase();
    let guildRoles = await roles[message.guild.id];

    if (!guildRoles.includes(args1))
        return message.reply(`this role is not supported`);
    let roler = message.guild.roles.cache.find(r => r.name === args1);

    if (!message.member.roles.cache.has(roler.id)) {
        return message.reply(`you don't have that role`);
    } else {
        message.reply(` doesn't feel a need for ${args1} anymore`);
        return message.member.roles.remove(roler).catch(console.error);
    }
}


/**
 * 
 * @param {message} message 
 */
function voting(message) {
    let modRole = message.guild.roles.cache.find(role => role.name === "ModStaff");
    if (message.member.roles.cache.has(modRole.id) || message.member.hasPermission("ADMINISTRATOR")) {
        let voteInMessage = message.content;
        let voteIn = voteInMessage.split(votesplit);
        let votemessage = voteIn[1].split(votesplit2);
        let voteArgC = votemessage.length;

        if (voteArgC > 10) {
            return message.channel.send(guildPersonality.polling.toManyArgs)
        }

        let content = `${emotes.emotes.q.text} ${votemessage[0]} \n`;
        for (let index = 1; index < voteArgC; index++) {
            content = content + `${emotes.emotes.numbers[index].text} ${votemessage[index]} \n`;
        }
        message.channel.send(content).then(async message => {
            message.pin();
            for (let index = 1; index < voteArgC; index++) {
                await message.react(emotes.emotes.numbers[index].emote)
            }
        })
    }
}


/**
 * @param {message} Message
 * 
 * @returns guildInfoEmbed: MessageEmbed
 */
function guildInfoEmbed(message) {
    let serverembed = new Discord.MessageEmbed()
        .setDescription("Server Information")
        .setColor("#ff7357")
        .setThumbnail(message.guild.iconURL())
        .addField("Server Name", message.guild.name)
        .addField("Created on", message.guild.createdAt)
        .addField("You Joined", message.member.joinedAt)
        .addField("Total Memebers", message.guild.memberCount)
        .addField("AFK Timeout Limit", message.guild.afkTimeout)
    return serverembed;
}


/**
 * @param {void}
 * 
 * @returns botInfoEmbed: MessageEmbed
 * 
 */
function botinfoEmbed() {
    //bot uptime calc
    let botuptime = bot.uptime;
    botuptime = botuptime * 0.001;
    let botembed = new Discord.MessageEmbed()
        .setDescription("Bot Information")
        .setColor("#ff7357")
        .setThumbnail(bot.user.displayAvatarURL())
        .addField("Bot Name", bot.user.username)
        .addField("Uptime in sec", botuptime);
    return botembed;
}
