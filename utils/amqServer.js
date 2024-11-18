const amqp=require('amqplib');
const {addToCart,createOrder}=require('../services/db')
let response;
let Response=(channel,msg,response)=>{
  channel.sendToQueue(
    msg.properties.replyTo,
    Buffer.from(JSON.stringify(response)),
    { correlationId: msg.properties.correlationId }
  );

}
let handleEvent = async(msg, channel) => {
    let content = JSON.parse(msg.content.toString());
    switch (content.type) {
      case "CREATE_ORDER":
        response = {
          STATUS:"SUCCESS",
          MESSAGE:"Order created for "+content        
   }
     let orderResponse=await createOrder(content.userID);
        Response(channel,msg,orderResponse);
        break;
        case "ADD_TO_CART":
         console.log("cart",content.product);
         response = {
                STATUS:"SUCCESS",
                MESSAGE:"Item added to cart for "+content.product.name          
         }
         try {
          let data=await addToCart(content.userID,content.product);
          console.log("db response",data);
          Response(channel,msg,data);

         } catch (error) {
          Response(channel,msg,error);

         }
        break;
    }
  };


async function startRpcServer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "rpc_queue";

  channel.assertQueue(queue, { durable: false });
  channel.prefetch(1);

  console.log("Awaiting RPC requests");

  channel.consume(queue, async (msg) => {

    const content = JSON.parse(msg.content.toString());
   // console.log("Received request:", content);
    console.log(msg.properties.replyTo);
    // Assuming we're just returning the total price for this example
    handleEvent(msg, channel);

    channel.ack(msg);
  });
}

module.exports = startRpcServer;

