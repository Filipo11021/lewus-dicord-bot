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

client.on('ready', async () => {
  const guild = await client.guilds.fetch('734427161695617125')
  const channel = guild.channels.cache.get('896823650727104523')

  const DWGvsFPX = '896840173067857952'
  const RNGvsPSG = '896840204378316800'
  const HLEvsFNC = '896840250377244742'
  const LNGvsGNG = '896840298523668530'
  const DFMvsT1 = '896840314545918002'
  const EDGvs100T = '896840346212892722'
  const TLvsMAD = '896840360771334175'
  const C9vsRGE = '896840383412203591'
  const msgArr = [
    { messageId: DWGvsFPX, name: 'DWG_vs_FPX' },
    { messageId: RNGvsPSG, name: 'RNG_vs_PSG' },
    { messageId: HLEvsFNC, name: 'HLE_vs_FNC' },
    { messageId: LNGvsGNG, name: 'LNG_vs_GNG' },
    { messageId: DFMvsT1, name: 'DFM_vs_T1' },
    { messageId: EDGvs100T, name: 'EDG_vs_100T' },
    { messageId: TLvsMAD, name: 'TL_vs_MAD' },
    { messageId: C9vsRGE, name: 'C9_vs_RGE' },
  ]

  msgArr.forEach(async (e) => {
    const msg = await channel.messages.fetch(e.messageId)
    const red = await lots_of_messages_getter(msg, '🔴')
    const blue = await lots_of_messages_getter(msg, '🔵')

    console.log(e.name, blue.length, red.length)
    const obj = { blue, red }
    fs.writeFileSync(`./${e.name}.json`, JSON.stringify(obj))
  })

  async function lots_of_messages_getter(message, emoji) {
    const sum_messages = []
    let last_id

    while (true) {
      const options = { limit: 100 }
      if (last_id) {
        options.after = last_id
      }

      const messages = await message.reactions.cache
        .get(emoji)
        .users.fetch(options)
      sum_messages.push(...Array.from(messages))
      //console.log(messages.size)
      if (messages.size != 100) {
        break
      }
      last_id = messages.last().id
    }

    const s = sum_messages.map((e) => e[1].username)
    //console.log(s.length)
    let unique = [...new Set(s)]
    //console.log(unique.length)
    return unique
  }
})

client.login(process.env.TOKEN)
