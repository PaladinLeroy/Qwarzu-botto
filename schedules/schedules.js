const fs = require("fs")
const AVLPriorityQueue= require("./AVLPriorityQueue.js")

const scheduleList = {}
const schedulesQueue = new AVLPriorityQueue()

const schedulesIdMap = {}

/*
 * Each node has key: timeStamp + random()
 * The random is to separate those with same timeStamp
 * value: {
 *      time: 1341351345325
 *      amount: 23
 *      next: () => {...} returning the next object with amount-1 new Timestamp
 *      exec: () => {...} function that gets executed
 *      args: arguments for the function
 * }
 */
let timeout = null
const startQueue = () => {
    const nextSchedule = schedulesQueue.peek()
    if (nextSchedule === null) {
        return
    }
    const timeObject = nextSchedule.value
    const oldTime = timeObject.time
    
    timeout = setTimeout(() => {
        // remove and reinsert
        schedulesQueue.pop()
        timeObject.time = timeObject.next()
        if (timeObject.amount !== null) {
            timeObject.amount--
        }
        if (timeObject.amount > 0 || timeObject.amount === null) {
            addSchedule(timeObject, timeObject.schedule.name, timeObject.args, timeObject.message)
        }
        
        
        // Execute after pushing back so if any schedule needs to look at the queue it doesn't just look at itself
        timeObject.schedule.fullyWrappedExec(timeObject.message, timeObject.args, oldTime)
        if (schedulesQueue.root !== null) {
            startQueue()
        }
    }, nextSchedule.key - Date.now())
}

const pokeQueue = () => {
    if (timeout === null) {
        startQueue()
    }
}

const addSchedule = (timeObject, scheduleName, args, message) => {
    if (timeObject.amount <= 0 && timeObject.amount !== null) {
        return
    }
    
    // fields that aren't set when the arguments are parsed
    timeObject.schedule = scheduleList[scheduleName]
    timeObject.args = args
    timeObject.message = message
    
    let id
    if (!timeObject.id) {
        id = Date.now().toString() + Math.floor(Math.random() * 1000).toString()
        timeObject.id = id
    } else {
        id = timeObject.id
    }
    
    const key = timeObject.time + Math.random()
    schedulesQueue.push(key, timeObject)
    schedulesIdMap[id] = key
    pokeQueue()
}

const removeSchedule = (scheduleId) => {
    const key = schedulesIdMap[scheduleId]
    const peek = schedulesQueue.peek()
    const removed = schedulesQueue.remove(key)
    console.log(schedulesIdMap)
    console.log(peek)
    delete schedulesIdMap[scheduleId]
    
    if (peek === removed) {
        clearTimeoutWrapped()
        startQueue()
    }
    
    if (removed !== null) {
        return true
    }
    return false
}

// To make sure timeout is always set to null when not active. It shows when the queue is running
const clearTimeoutWrapped = () => {
    clearTimeout(timeout)
    timeout = null
}

//export the list before anything is imported into it to avoid circular dependencies
module.exports = {"schedules": scheduleList, "schedulesQueue": schedulesQueue, "addSchedule": addSchedule, "removeSchedule": removeSchedule}

// Not sure why it has to go to ./listeners when . is already the commands folder
const files = fs.readdirSync("./schedules");

for (const fileIndex in files) {
    if(files[fileIndex].startsWith("schedule_")) {
        const schedule = require("./" + files[fileIndex])
        scheduleList[schedule.name] = schedule
    }
}
