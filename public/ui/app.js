import { connectPLC, writePLC, readPLC } from '../services/services.js'

// HTML ELEMENTS

// Connetion inputs 

const IP = document.getElementById('ip')
const PORT = document.getElementById('port')
const RACK = document.getElementById('rack')
const SLOT = document.getElementById('slot')
const STATUS = document.getElementById('status_plc')
const BUTTON_CONNECT = document.getElementById('connect_button')

const TRANSPORTE_ESCRITURA = document.getElementById('transporte_escritura')
const TRANSPORTE_LECTURA = document.getElementById('transporte_lectura')
const TRANSPORTE_N_ESCRITURA = document.getElementById('transporte')
const TRANSPORTE_N_LECTURA = document.getElementById('transporte_read')

const TABLE_ESCRITURA = document.getElementById('tabla_escritura')
const TABLE_LECTURA = document.getElementById('tabla_lectura')

const FORM = document.getElementById('write_plc')
const READ_BUTTON = document.getElementById('read-button')

document.addEventListener('change', (e) => {
    if (e.target === TRANSPORTE_ESCRITURA) {
        TRANSPORTE_N_ESCRITURA.textContent = SelectedOption(TRANSPORTE_ESCRITURA)
    }
    if (e.target === TRANSPORTE_LECTURA) {
        TRANSPORTE_N_LECTURA.textContent = SelectedOption(TRANSPORTE_LECTURA)
    }
})




window.onload = () => {
    let config = JSON.parse(localStorage.getItem('config-plc'))
    let connection = localStorage.getItem('connection')
    const { ip, port, rack, slot } = config
    IP.value = ip
    PORT.value = port
    RACK.value = rack
    SLOT.value = slot

    if (connection) {
        STATUS.style.backgroundColor = 'green'
    }
}



// Connect to PLC
BUTTON_CONNECT.addEventListener('click', async (e) => {
    e.preventDefault()
    let config = {
        ip: IP.value,
        port: PORT.value,
        rack: RACK.value,
        slot: SLOT.value
    }

    localStorage.setItem('config-plc', JSON.stringify(config))


    const connected = await connectPLC(config)
    if (connected) {
        localStorage.setItem('connection', true)
        STATUS.style.backgroundColor = 'green'
    } else {
        STATUS.style.backgroundColor = 'red'
        localStorage.setItem('connection', false)

    }


})



// WRITE PLC VARIABLES
let values_input
let ids_input
let object_write

FORM.addEventListener('submit', async (e) => {
    values_input = []
    ids_input = []
    e.preventDefault()
    let transporte_write = SelectedOption(TRANSPORTE_ESCRITURA)
    let inputs = FORM.querySelectorAll('input')
    inputs.forEach((input, index) => {
        console.log(input)
        values_input.push(index === 0 ? Boolean(parseInt(input.value)) : parseInt(input.value))
        ids_input.push(input.id)
    })

    object_write = {
        transporte: transporte_write,
        names: ids_input,
        values: values_input
    }

    const responseObject = await writePLC(object_write)

    for (const property in responseObject) {
        const table_row = TABLE_ESCRITURA.querySelector(`td[name="${property}"]`)
        table_row.textContent = responseObject[property]
    }

})

// Read PLC VARIABLES
READ_BUTTON.addEventListener('click', async (e) => {
    let transporte_read = SelectedOption(TRANSPORTE_LECTURA)
    ids_input = []
    let inputs = FORM.querySelectorAll('input')
    inputs.forEach((input) => {
        ids_input.push(input.id)
    })

    const responseObject = await readPLC(transporte_read, ids_input)
    for (const property in responseObject) {
        const table_row = TABLE_LECTURA.querySelector(`td[name="${property}"]`)
        table_row.textContent = responseObject[property]
    }

})


function SelectedOption(select_element) {
    let option = select_element.options[select_element.selectedIndex].value
    return option
}

