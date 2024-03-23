const ExtendedClient = require('../../class/ExtendedClient');
const Canvas = require('canvas');
const mongoose = require('../../handlers/mongoose')
const dbCleanup = require('../../modules/cronjobs');

module.exports = {
    event: 'ready',
    once: true,
    /**
     * 
     * @param {ExtendedClient} _
     * @param {import('discord.js').Client<true>} bot
     * @returns
     */
    run: (_, bot) => {
        console.log('Online!')
    
        Canvas.registerFont("./src/fonts/ulm_grotesk.ttf", { family: "grotesk" });
        Canvas.registerFont("./src/fonts/osaka-re.ttf", { family: "osaka" })
        Canvas.registerFont("./src/fonts/Orbitron-VariableFont_wght.ttf", { family: "orbitron" })

        mongoose();
        dbCleanup();
    }
}