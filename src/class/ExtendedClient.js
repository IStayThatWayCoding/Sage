const { Client, Partials, Collection, GatewayIntentBits, Discord, IntentsBitField } = require("discord.js");

const commands = require('../handlers/commands');
const events = require('../handlers/events');
const config = require('../config')
const deploy = require('../handlers/deploy')
// const mongoose = require('../handlers/mongoose')
const components = require('../handlers/components');
const getTwitchFollowers = require('../modules/getTwitchFollowers');
const getMemberCount = require('../modules/getMemberCount');
const getSubCount = require('../modules/getSubCount');
const Canvas = require('canvas');

module.exports = class extends Client {
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            modals: new Collection(),
            autocomplete: new Collection(),
            buttons: new Collection(),
            selects: new Collection(),
        }

    };
    applicationcommandsArray = [];

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages,
            ],        
            partials: [
                Partials.Channel
            ],
            presence: {
                activities: [{
                    name: 'Sage',
                    type: 4,
                    state: "Being born",
                }]
            }
        });
    };

    start = async () => {
        commands(this);
        events(this);
        components(this);
        getTwitchFollowers(this);
        getMemberCount(this);
        getSubCount(this);

        // mongoose();

        await this.login(process.env.TOKEN);
        
        deploy(this, config);
    }
};