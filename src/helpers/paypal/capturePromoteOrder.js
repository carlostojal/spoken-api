const paypal = require("@paypal/checkout-server-sdk");
const Post = require("../../db_models/Post");

const capturePromoteOrder = async (order_id) => {

  // capture the order and check if it was approved
  const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
  const client = new paypal.core.PayPalHttpClient(environment);

  // authorize the order
  let request = new paypal.orders.OrdersAuthorizeRequest(order_id);
  request.requestBody({});

  let response;
  try {
    response = await client.execute(request);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_AUTHORIZING_ORDER");
  }

  const order = response.result;
  const auth_id = response.result.purchase_units[0].payments.authorizations[0].id;

  // capture the authorized order
  request = new paypal.payments.AuthorizationsCaptureRequest(auth_id);
  request.requestBody({});

  try {
    response = await client.execute(request);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_CAPTURING_ORDER");
  }

  const capture_id = response.result.id;

  // promote the post
  try {
    let p = await Post.findById(order.purchase_units[0].reference_id);
    p.promoted = true;
    await p.save();
  } catch(e) {
    // if it fails, user is refunded
    try {
      request = await new paypal.payments.CapturesRefundRequest(capture_id);
      request.requestBody({
        "amount": order.purchase_units[0].payments.authorizations[0].amount
      });
      response = client.execute(request);
    } catch(e) {
      console.error(e);
      throw new Error("ERROR_REFUNDING");
    }
    throw new Error("ERROR_PROMOTING_POST");
  }

  return null;
};

module.exports = capturePromoteOrder;