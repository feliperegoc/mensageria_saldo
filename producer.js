const amqp = require("amqplib");
const dotenv = require("dotenv").config();

let api_key = process.env.AMQP;

async function sendMessage(quantidade) {
  const queue = "transactions";
  const replyQueue = "response_queue";

  try {
    const connection = await amqp.connect(api_key);
    const channel = await connection.createChannel();

    // Criar fila principal
    await channel.assertQueue(queue, { durable: false });
    
    // Criar fila de resposta
    await channel.assertQueue(replyQueue, { durable: false });

    // Enviar mensagem com a quantidade
    channel.sendToQueue(queue, Buffer.from(quantidade.toString()), {
      replyTo: replyQueue
    });
    
    console.log("Solicitação de transação enviada: " + quantidade);

    // Aguardar resposta
    channel.consume(replyQueue, (msg) => {
      const response = JSON.parse(msg.content.toString());
      
      if (response.success) {
        console.log("✅ " + response.message);
      } else {
        console.log("❌ " + response.message);
      }
      
      console.log(`Saldo atual: ${response.saldo}`);
      
      setTimeout(() => {
        connection.close();
        process.exit(0);
      }, 500);
    }, { noAck: true });

  } catch (error) {
    console.error("Erro:", error);
    connection.close();
  }
}

// Exemplo de uso: passar o valor como argumento da linha de comando -> node producer.js 500
const valor = parseFloat(process.argv[2]);

if (isNaN(valor) || valor <= 0) {
  console.log("Por favor, forneça um valor válido maior que 0");
  process.exit(1);
}

sendMessage(valor);
