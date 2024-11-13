const dotenv = require("dotenv").config();
const amqp = require("amqplib");

let api_key = process.env.AMQP;
let saldo = 1000;

async function receiveMessage() {
  const queue = "transactions";

  try {
    const connection = await amqp.connect(api_key);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    console.log("Aguardando transações na fila: " + queue);
    console.log("Saldo atual: " + saldo);

    channel.consume(queue, (msg) => {
      const quantidade = parseFloat(msg.content.toString());
      
      if (quantidade <= saldo) {
        saldo -= quantidade;
        console.log(`Transação aprovada! Valor retirado: ${quantidade}`);
        console.log(`Novo saldo: ${saldo}`);
        
        // Enviar confirmação para o produtor
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ 
            success: true, 
            message: "Transação realizada com sucesso",
            saldo: saldo
          }))
        );
      } else {
        console.log(`Transação negada! Valor solicitado (${quantidade}) excede o saldo disponível (${saldo})`);
        
        // Enviar negação para o produtor
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ 
            success: false, 
            message: "Saldo insuficiente",
            saldo: saldo
          }))
        );
      }
      
      channel.ack(msg);
    });
    
  } catch (error) {
    console.error("Erro:", error);
  }
}

receiveMessage();
