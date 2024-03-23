module.exports = {
    bot: {
        token: process.env.TOKEN,
        id: process.env.BOT_ID,
    },
    handler: {
        prefix: "<",
        deploy: true,
        commands: {
            prefix: true,
            slash: true,
            user: true,
            message: true,
        },
        mongodb: {
            enabled: true,
            uri: process.env.MONGO_DB
        },
    },
    users: {
        developers: ["274021702411747328"],
    },
    messageSettings: {
        nsfwMessage: "The current channel is not a NSFW channel.",
        developerMessage: "This command is developer only.",
        cooldownMessage: "Slow down buddy! You're too fast to use this command ({cooldown}s).",
        globalCooldownMessage: "Slow down buddy! This command is on a global cooldown ({cooldown}s).",
        notHasPermissionMessage: "You do not have the permission to use this command.",
        notHasPermissionComponent: "You do not have the permission to use this component.",
        missingDevIDsMessage: "This is a developer only command, but unable to execute due to missing user IDs in configuration file.",
        signature: "Sage | Developed with ❤️ by istay"
    }
}