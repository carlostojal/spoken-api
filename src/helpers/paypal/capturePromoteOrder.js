const paypal = require("@paypal/checkout-server-sdk");
const promotePostById = require("../controllers/posts/promotePostById");

const capturePromoteOrder = (order_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    // capture the order and check if it was approved
    const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    const client = new paypal.core.PayPalHttpClient(environment);

    let request = new paypal.orders.OrdersCaptureRequest(order_id);
    request.requestBody({});

    let response;
    try {
      response = await client.execute(request);
    } catch(e) {
      return reject(e);
    }

    const order = response.result;

    // promote the post
    try {
      await promotePostById(order.purchase_units[0].reference_id, mysqlPool);
    } catch(e) {
      return reject(e);
    }

    return resolve(null);
  });
};

module.exports = capturePromoteOrder;