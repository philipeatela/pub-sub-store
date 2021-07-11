const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const report = {}

function processMessage(msg) {
    try {
        const deliveryData = JSON.parse(msg.content)
        console.log('Attempting to process report...');
        if (deliveryData.products && deliveryData.products.length) {
            deliveryData.products.forEach(({ name, value }) => {
                const currentProductEntry = report[name];
                if (currentProductEntry) {
                    const currentProductValue = currentProductEntry.value;
                    report[name].value = Number(currentProductValue) + Number(value);
                    return;
                }
                report[name] = { value }
            })
            console.log('UPDATED REPORT: ', report);
        }
    } catch(error) {
        console.log(`X ERROR TO PROCESS: ${error}`)
    }
}

async function consume() {
    //TODO: Constuir a comunicação com a fila 
    console.log(`INSCRITO COM SUCESSO NA FILA: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})
} 

consume()
