const { Client, Intents } = require('discord.js')
const fs = require('fs')
require('dotenv').config()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

const messagesArr = [
  { messageId: '897194808848814151', name: 'T1_vs_EDG' },
  { messageId: '897194906437697537', name: 'RGE_vs_DWG' },
]

client.on('ready', async () => {
  const guild = await client.guilds.fetch('734427161695617125')
  const channel = guild.channels.cache.get('896823650727104523')

  messagesArr.forEach(async (e) => {
    const msg = await channel.messages.fetch(e.messageId)
    const blue = await getUsers(msg, '🔵')
    const red = await getUsers(msg, '🔴')

    console.log(e.name, blue.length, red.length)
    const obj = { blue, red }

    const path = `./${e.name}.json`
    fs.closeSync(fs.openSync(path, 'w'))
    fs.writeFileSync(path, JSON.stringify(obj))
  })

  async function getUsers(message, emoji) {
    const sumUsers = []
    let lastId

    while (true) {
      const options = { limit: 100 }
      if (lastId) {
        options.after = lastId
      }

      const messages = await message.reactions.cache
        .get(emoji)
        .users.fetch(options)
      sumUsers.push(...Array.from(messages))
   
      if (messages.size != 100) {
        break
      }
      lastId = messages.last().id
    }

    const usersArr = sumUsers.map((userObj) => {
      const obj = {
        username: userObj[1].username,
        tag: userObj[1].discriminator,
      }
      return obj
    })

    return usersArr
  }
})

client.login(process.env.TOKEN)
