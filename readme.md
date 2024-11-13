# Sistema de Controle de Saldo com RabbitMQ

Este é um sistema simples de produtor/consumidor utilizando RabbitMQ para controlar transações de saldo. O sistema consiste em dois componentes: um consumidor que mantém o saldo e processa as transações, e um produtor que envia solicitações de retirada.

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes do Node)
- RabbitMQ Server

## Instalação

1. Clone este repositório ou baixe os arquivos
2. Instale as dependências necessárias:
```bash
npm install amqplib dotenv
```

3. Crie um arquivo `.env` na raiz do projeto e adicione sua string de conexão do RabbitMQ:
```
AMQP=amqp://seu_usuario:sua_senha@localhost
```

## Como Usar

### 1. Iniciando o Consumidor

O consumidor é responsável por manter o saldo e processar as transações. Para iniciá-lo:

```bash
node consumer.js
```

Quando iniciado, o consumidor:
- Estabelece um saldo inicial de 1000
- Aguarda por solicitações de transação
- Mostra o saldo atual no console

### 2. Enviando Transações (Produtor)

Para enviar uma solicitação de retirada, use o produtor passando o valor como argumento:

```bash
node producer.js [valor]
```

Exemplo:
```bash
node producer.js 500  # Para tentar retirar 500
```

### Regras do Sistema

- O saldo inicial é de 1000
- Não é possível retirar um valor maior que o saldo disponível
- O valor da transação deve ser maior que 0
- O sistema informará se a transação foi aprovada ou negada
- Após cada transação, o novo saldo é exibido

### Exemplos de Uso

1. Transação bem-sucedida:
```bash
node producer.js 300
# Resultado esperado:
# Solicitação de transação enviada: 300
# ✅ Transação realizada com sucesso
# Saldo atual: 700
```

2. Transação negada (valor maior que o saldo):
```bash
node producer.js 1500
# Resultado esperado:
# Solicitação de transação enviada: 1500
# ❌ Saldo insuficiente
# Saldo atual: 700
```

3. Entrada inválida:
```bash
node producer.js 0
# Resultado esperado:
# Por favor, forneça um valor válido maior que 0
```

### Encerrando o Sistema

- O produtor encerra automaticamente após cada transação
- Para encerrar o consumidor, use Ctrl+C no terminal onde ele está rodando

## Observações Importantes

- Mantenha o consumidor sempre rodando para processar as transações
- O saldo é reiniciado para 1000 sempre que o consumidor é reiniciado
- Certifique-se de que o RabbitMQ Server está rodando antes de iniciar o sistema

## Solução de Problemas

Se você encontrar erros de conexão:
1. Verifique se o RabbitMQ está rodando
2. Confirme se as credenciais no arquivo .env estão corretas
3. Certifique-se de que todas as dependências foram instaladas corretamente
