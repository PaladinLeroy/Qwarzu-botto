const {Command} = require("./Command.js")
const database = require("../helper/database.js")

const sortSex = (sexCounter) => {
    let sortedArray = []
    for (let i = 0; i < Object.keys(sexCounter).length; i++) {
        sortedArray[i] = {"id": "1", "count": -1}
        for (userId in sexCounter) {
            const count = sexCounter[userId]
            if (count >= sortedArray[i].count) {
                sortedArray[i].id = userId
                sortedArray[i].count = count
            }
        }
        delete sexCounter[sortedArray[i].id]
    }
    return sortedArray
}


const exec = async (message, args) => {
    const sexCounter = database.read("sexCounter")
    const sexLeaderboard = sortSex(sexCounter)
    
    let reply = "Sex counter leaderboard\n-----------------\n"
    for (let i = 0; i < Math.min(10, sexLeaderboard.length); i++) {
        const user = await message.guild.members.fetch(sexLeaderboard[i].id)
        
        reply = reply + user.user.username + ":    " + sexLeaderboard[i].count + "\n"
    }
    
    await message.channel.send(reply)
}

const description = ""

const sexLeaderboard = new Command("sexleaderboard", description, exec)

module.exports = sexLeaderboard
