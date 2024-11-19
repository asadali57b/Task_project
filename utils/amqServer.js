const amqp = require("amqplib");
const { addToCart, createOrder } = require("../services/db");

const sendResponse = (channel, msg, response) => {
  channel.sendToQueue(
    msg.properties.replyTo,
    Buffer.from(JSON.stringify(response)),
    { correlationId: msg.properties.correlationId }
  );
};

const handleEvent = async (msg, channel) => {
  try {
    const content = JSON.parse(msg.content.toString());
    console.log("Received request:", content);

    // Extract userID correctly
    const id=content.userId||content.userID;
    console.log("userID:", id);

    if (!id) {
      console.error("Invalid or missing userID in request");
      return sendResponse(channel, msg, { status: "FAILED", message: "Invalid userID" });
    }
    switch (content.type) {
      case "CREATE_ORDER":
        console.log(`Processing CREATE_ORDER for userID: ${id}`);
        console.log(`TYPE: ${content.type}`);

        try {
          const orderResponse = await createOrder(id);
          sendResponse(channel, msg, orderResponse);
        } catch (error) {
          console.error("Error creating order:", error.message);
          sendResponse(channel, msg, { status: "ERROR", message: error.message });
        }
        break;

      case "ADD_TO_CART":
        console.log(`Processing ADD_TO_CART for userID: ${id}, product:`, content.product);
        try {
          const cartResponse = await addToCart(id, content.product);
          sendResponse(channel, msg, cartResponse);
        } catch (error) {
          console.error("Error adding to cart:", error.message);
          sendResponse(channel, msg, { status: "ERROR", message: error.message });
        }
        break;

      default:
        console.error(`Unknown event type: ${content.type}`);
        sendResponse(channel, msg, { status: "FAILED", message: "Unknown event type" });
    }
  } catch (error) {
    console.error("Error handling event:", error.message);
    sendResponse(channel, msg, { status: "ERROR", message: error.message });
  }
};



const startRpcServer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "rpc_queue";

    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);

    console.log("RPC Server is running. Awaiting requests...");

    channel.consume(queue, async (msg) => {
      console.log("Received request:", msg.content.toString());
      await handleEvent(msg, channel);
      // await rpcServer(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    });

    process.on("SIGINT", async () => {
      console.log("Closing RPC Server...");
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting RPC Server:", error.message);
    process.exit(1);
  }
};

module.exports = startRpcServer;

