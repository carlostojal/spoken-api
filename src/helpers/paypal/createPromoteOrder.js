const paypal = require("@paypal/checkout-server-sdk");

const createPromoteOrder = (post_id) => {
  return new Promise(async (resolve, reject) => {
    const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    const client = new paypal.core.PayPalHttpClient(environment);

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      "intent": "CAPTURE",
      "purchase_units": [
        {
          "reference_id": post_id,
          "amount": {
            "currency_code": process.env.POST_PROMOTION_CURRENCY,
            "value": process.env.POST_PROMOTION_COST
          },
          "description": `Spoken post promotion. Post ID: ${post_id}`
        }
      ],
      "application_context": {
        "user_action": "PAY_NOW",
        "return_url": `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/${process.env.POST_PROMOTION_RETURN_URL}`
      }
    });

    let response;
    try {
      response = await client.execute(request);
    } catch(e) {
      return reject(e);
    }
    
    return resolve(response.result);
  });
};

module.exports = createPromoteOrder;