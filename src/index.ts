import client, {Connection, Channel, ConsumeMessage} from 'amqplib'

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// Function to send some messages before consuming the queue
// const sendMessages = (channel: Channel) => {
//   for (let i = 0; i < 10; i++) {
//     channel.sendToQueue('devicestatus', Buffer.from(`message ${i}`))
//   }
// }

// consumer for the queue.
// We use currying to give it the channel required to acknowledge the message
const consumer = (channel: Channel) => (msg: ConsumeMessage | null): void => {
  if (msg) {
    // Display the received message
    console.log(msg.content.toString() + " | " + new Date())
    // Acknowledge the message
    //channel.ack(msg)
  }
}

const start = async () => {
  const connection: Connection = await client.connect('amqp://devicestatus:devicestatus@10.10.0.10:5672')
  // Create a channel
  const channel: Channel = await connection.createChannel()
  // Makes the queue available to the client
  await channel.assertQueue('devicestatus')
  // Send some messages to the queue
  // sendMessages(channel)
  // Start the consumer
  await channel.consume('devicestatus', consumer(channel))
}

start()