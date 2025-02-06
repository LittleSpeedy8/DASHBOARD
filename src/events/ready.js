const ms = require("ms");
const { Client } = require("discord.js")
const { promisify } = require("util");
const wait = promisify(setTimeout)
module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {
        console.log('Ready!');

        var used1 = false;

     
    
        setInterval(() => {
            const Users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
            const Servers = client.guilds.cache.reduce((acc, guild) => acc + 1, 0);
            if(used1){
                  client.user.setActivity({
                    name: `${Users} Members`,
                    type: 3,
                })
            used1 = false;}
          else{
            client.user.setActivity({
                name: `${Servers} Servers`,
                type: 3,
            })
            used1 = true;}
        }, ms("5s"))


       client.user.setPresence({
            status: "dnd"
        })
    }
};
