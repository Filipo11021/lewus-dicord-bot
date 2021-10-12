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

//['team1','team2']
const matches = [
  ['T1', 'EDG'],
  ['RGE', 'DWG'],
  ['PSG', 'HLE'],
]
const day = '2'

const resultsCmd = '!results'
const startCmd = '!start'
const adminUsers = [
  { username: 'Hubert', tag: '4251' },
  { username: 'Lewus', tag: '7210' }
]


const guildId = '734427161695617125'
const channelId = '896823650727104523'

client.on('ready', async () => {})

client.on('messageCreate', async (message) => {
  const guild = await client.guilds.fetch(guildId)
  const channel = guild.channels.cache.get(channelId)

  const checkAdmins = adminUsers.some((e) => e.username === message.author.username && e.tag === message.author.discriminator)
  if (message.content === resultsCmd && checkAdmins) {
    message.delete()
    const res = fs.readFileSync(`./messages.json`, { encoding: 'utf8' })
    const messages = JSON.parse(res)
    const currentDate = new Date()
    const currentTime = currentDate.toLocaleTimeString().replaceAll(':', '.')
    const currentDay = `day${day}`
    const dir = `${currentTime} ${currentDay}`
    fs.mkdirSync(dir)

    for (const e of messages) {
      const msg = await channel.messages.fetch(e.messageId)
      const blue = await getUsers(msg, '🔵')
      const red = await getUsers(msg, '🔴')

      console.log(e.name, blue.length, red.length)
      const obj = { blue, red }

      const path = `./${dir}/test_${e.name}.json`
      fs.closeSync(fs.openSync(path, 'w'))
      fs.writeFileSync(path, JSON.stringify(obj))
    }

    fs.closeSync(fs.openSync('./currentDir.json', 'w'))
    fs.writeFileSync('./currentDir.json', JSON.stringify(dir))
  }
  if (message.content === startCmd && checkAdmins) {
    message.delete()
    let messages = []
    const guild = await client.guilds.fetch(guildId)
    const channel = guild.channels.cache.get(channelId)
    channel.send(`Worlds 2021 Group Stage Day ${day}`)
    for (const match of matches) {
      const message = await channel.send(`${match[0]} vs ${match[1]}`)
      await message.react('🔵')
      await message.react('🔴')

      messages.push({
        messageId: message.id,
        name: `${match[0]}_vs_${match[1]}`,
        blue: match[0],
        red: match[1],
      })
    }
    const path = './messages.json'
    fs.closeSync(fs.openSync(path, 'w'))
    fs.writeFileSync(path, JSON.stringify(messages))
    console.log('end')
  }

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
