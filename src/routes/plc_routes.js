const router = require('express').Router()
const TRANSPORTES = require('../plc/tags')
const nodes7 = require('nodes7')
const conn = new nodes7
//Conected
var doneReading = false;
var doneWriting = false


// Conectar PLC
router.post('/connect/', async (req, res) => {
    const config = req.query
    console.log(req.query)
    const conected = await conectToPLC(conn, config)
    res.status(200).json(conected)
})



// Escribir PLC
router.post('/', async (req, res) => {
    const objectWrite = req.body
    const { transporte, names, values } = objectWrite
    const variable = TRANSPORTES[transporte]
    conn.setTranslationCB(function (tag) { return variable[tag]; });
    conn.addItems(names);
    conn.writeItems(names, values, valuesWritten)
    const valuesRead = await readValues(conn)
    conn.removeItems()
    res.status(200).json(valuesRead)

})

// Leer PLC
router.get('/:names', async (req, res) => {
    const transporte = req.query.transporte
    const { names } = req.params
    const names_arr = names.split(',')
    const variable = TRANSPORTES[transporte]

    conn.setTranslationCB(function (tag) { return variable[tag]; })
    conn.addItems(names_arr);

    const valuesRead = await readValues(conn)
    conn.removeItems()

    res.status(200).json(valuesRead)

})



// function connected(err) {
//     if (typeof (err) !== "undefined") {
//         // We have an error. Maybe the PLC is not reachable.
//         console.log(err);
//         process.exit();
//     }
// }


function valuesWritten(anythingBad) {
    if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
    console.log("Done writing.");
    doneWriting = true;
    // if (doneReading) { process.exit(); }
}


async function readValues(conn) {
    return new Promise((res, rej) => {
        conn.readAllItems((error, values) => {
            if (error) { rej("SOMETHING WENT WRONG READING VALUES!!!!") }
            doneReading = true;
            res(values)
        });
    })
}

async function conectToPLC(conn, config) {
    const { ip, port, rack, slot } = config
    return new Promise((res, rej) => {
        conn.initiateConnection({ port: port, host: ip, rack: rack, slot: slot }, (err) => {
            if (typeof (err) !== "undefined") {
                // We have an error. Maybe the PLC is not reachable.
                console.log(err);
                rej(false)
                process.exit();

            } else {
                res(true)
            }
        })
    })
}


module.exports = router