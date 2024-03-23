const mongo = require('../handlers/mongoose');
const rankSchema = require('../schemas/rank-schem');
const cronjob = require('cron').CronJob;
const path = require('path');

module.exports = async (bot) => {
    const guild = bot.guilds.cache.get('755968485854675065');

    const rankSort = new cronjob('0 0 * * *', async function () {
        await mongo().then(async mongoose => {
            const sort = await rankSchema.find().catch(err => console.error(`${path.basename(__filename)} There was a problem finding a database entry: `, err));

            sortArr = [];
            for(const data of sort) {
                const {id, xp} = data;

                sortArr.push({ id, xp});
            }

            sortArr.sort(function (a, b) {
                return b.xp - a.xp;
            });

            for (var i = 0; i < sortArr.length; i++) {
                const exists = await guild.members.cache.get(sortArr[i].id)

                if(!exists) {
                    await rankSchema.findOneAndRemove({ id: sortArr[i].id })
                    .catch(err => console.error(`${path.basename(__filename)} There was a problem removing a database entry: `, err));
                }
            }

            rankPosArr = [];
            for(let i = 0; i < sortArr.length; i++) {
                await rankPosArr.push({ pos: i + 1, id: sortArr[i].id, xp: sortArr[i].xp });
            }

            for (var i = 0; i < rankPosArr.length; i++) {
                await rankSchema.findOneAndUpdate({
                    id: rankPosArr[i].id
                }, {
                    rank: rankPosArr[i].pos
                }, {
                    upsert: true
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));
            }
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem connecting to the database: `, err));

        rankSort.start();
    })
}