
// Connect to PLC

async function connectPLC({ ip, port, rack, slot }) {
    let response = await fetch(`http://localhost:3200/plc/connect/?ip=${ip}&port=${port}&rack=${rack}&slot=${slot}`, {
        method: 'POST',
    })

    let result = await response.json()
    return result
}



// Write PLC 
async function writePLC(data) {
    let response = await fetch("http://localhost:3200/plc/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    })

    let result = await response.json()
    return result
}

// Read PLC
async function readPLC(transporte, names) {
    let response = await fetch(`http://localhost:3200/plc/${names}?transporte=${transporte}`, {
        method: 'GET',
    })

    let result = await response.json()
    return result
}


export { connectPLC, writePLC, readPLC }