require('dotenv').config();
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fs = require('fs')

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
let bailaOn = false;
let moveNum = 1
let order = 0

// Console log when logged in
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    // Getting the command and the arguments
    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)
    arrOfPlayers = args

    
    // Save players to JSON file
    
    if (bailaOn == false) {
        let players = [];
        arrOfPlayers.forEach(player => {
            players.push(player)
        });
        createJSON(players)
    }

    // Check if command was called
    if (cmd === "!baila") {
        if (bailaOn == false) {
            // Begin the game
            bailaOn = true;
            // Card selection
            let cardSelection = SelectCard()

            const regex = /^(.*?)_/;
            const found = cardSelection.match(regex);
            let cardType = found[1]


            // Embed for the game
            const bailaEmbed = new MessageEmbed()
                .setColor('#fe9b39')
                .setTitle('Baila')
                .setDescription("Move number: "+ moveNum + '\n\n' + 'Card meaning: ' + GetCardMeaning(cardType))
                // .setDescription('Card meaning: ' + GetCardMeaning(cardType))
                for (let i=0; i < arrOfPlayers.length; i++) {
                    if (moveNum-1 == i) {
                        bailaEmbed.addField(arrOfPlayers[i], "My turn", true)
                    } else {
                        bailaEmbed.addField(arrOfPlayers[i], "-", true)
                    }
                }

            msg.channel.send({ embeds: [bailaEmbed], files: ['./cards/' + cardSelection] }).then(sentEmbed => {
                sentEmbed.react("➡")
            });

        } else if (bailaOn == true) {
            bailaOn == false
            msg.channel.send("Game over!");
        }
    } else if (cmd === "!next") {
        if (bailaOn == true) {
            // Get the array back from JSON
            let readJson = fs.readFileSync("./players.json", {encoding:'utf8', flag:'r'})
            let playersArr = JSON.parse(readJson).names
            // Players order
            moveNum +=1;
            order +=1;
            // Reset players order
            if (order >= playersArr.length) {
                order = 0
            }
            // Card selection
            let cardSelection = SelectCard()
            const regex = /^(.*?)_/;
            const found = cardSelection.match(regex);
            let cardType = found[1]

            // Embed message
            const bailaEmbed = new MessageEmbed()
                .setColor('#fe9b39')
                .setTitle('Baila')
                .setDescription("Move number: "+ moveNum + '\n\n' + 'Card meaning: ' + GetCardMeaning(cardType))
                for (let i=0; i < playersArr.length; i++) {
                    if (order == i) {
                        bailaEmbed.addField(playersArr[i], "My turn", true)
                    } else {
                        bailaEmbed.addField(playersArr[i], "-", true)
                    }
                }
            msg.channel.send({ embeds: [bailaEmbed], files: ['./cards/' + cardSelection] }).then(sentEmbed => {
                sentEmbed.react("➡")
            });
        } else {
            msg.channel.send("There is not a game going on. Start one with '!baila player1 player2 player3 etc.'");
        }

    }
})

function createJSON(players) {
    const PlayerObject = new Object();
    PlayerObject.names = players
    
    let jsonPlayers = JSON.stringify(PlayerObject)
    console.log(jsonPlayers)
    fs.writeFileSync("./players.json", jsonPlayers);
}

function SelectCard() {
    var files = fs.readdirSync('./cards/')
    let chosenFile = files[Math.floor(Math.random() * files.length)]
    return chosenFile
}

function GetCardMeaning(cardType) {
    switch (cardType) {
        case 'two':
            return "You drink."
        case 'three':
            return "Send your best meme, whoever's is the funniest gets to choose who drinks."
        case 'four':
            return "Choose who drinks."
        case 'five':
            return "Ask anyone a question and if they refuse to answer, they have to drink."
        case 'six':
            return "Make a rule for others. For example, they can't use the word “what”, whoever breaks the rule has to drink."
        case 'seven':
            return "Say a word, the next person says that word and adds another until someone can't remember the order. For example “I”, “I am”, “I am cute”, etc."
        case 'eight':
            return "Choose a partner until the next 8 is pulled, every time you drink, your partner has to drink as well."
        case 'nine':
            return "A round of never have I ever. Everybody has 3 lives, starting with the person who drew the card each player says “never have I ever [something].”"
        case 'ten':
            return "The first person says the category and starting from them, everyone has to say another related word, until someone can't think of a word or repeats an already said word. (i.e. “Candy bars” and then proceed as “Mars”, “Snickers”, etc.)"
        case 'jock':
            return "All who identify as male drink."
        case 'queen':
            return "All who identify as female drink."
        case 'king':
            return "Last one to type “not me” in the chat has to drink."
        case 'ace':
            return "Everyone drinks."
        default:
            return "Could not get info about this card."
        }

}

client.login(process.env.DISCORD_TOKEN);

