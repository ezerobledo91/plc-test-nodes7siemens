// Conexión con PLC mediante nodes7
const nodes7 = require('nodes7')
const conn = new nodes7
conn.initiateConnection({ port: 102, host: '192.168.220.191', rack: 0, slot: 1 }, connected)


var doneReading = false;
var doneWriting = false


function connected(err) {
    if (typeof (err) !== "undefined") {
        // We have an error. Maybe the PLC is not reachable.
        console.log(err);
        process.exit();
    }

    console.log("Conectado al PLC")
    conn.setTranslationCB(function (tag) { return variables[tag]; }); // This sets the "translation" to allow us to work with object names
    conn.addItems(['nuevo_dato', 'transporte']);
    // conn.removeItems(['TEST2', 'TEST3']); // We could do this.
    // conn.writeItems(['TEST5', 'TEST6'], [ 867.5309, 9 ], valuesWritten); // You can write an array of items as well.
    conn.writeItems(['nuevo_dato', 'transporte', 'comando'], [true, false, false], valuesWritten); // You can write a single array item too.
    conn.readAllItems(valuesReady);
}

function valuesReady(anythingBad, values) {
    if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
    console.log(values);
    doneReading = true;
    // if (doneWriting) { process.exit(); }
}

function valuesWritten(anythingBad) {
    if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
    console.log("Done writing.");
    doneWriting = true;
    // if (doneReading) { process.exit(); }
}
