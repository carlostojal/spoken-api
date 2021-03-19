const paypal = require("@paypal/checkout-server-sdk");

const createPromoteOrder = () => {
  return new Promise(async (resolve, reject) => {
    const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    const client = new paypal.core.PayPalHttpClient(environment);

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      "intent": "CAPTURE",
      "purchase_units": [
        {
          "amount": {
            "currency_code": process.env.POST_PROMOTION_CURRENCY,
            "value": process.env.POST_PROMOTION_COST
          },
          "description": "Spoken post promotion."
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
      // console.log(JSON.stringify(response.result));
    } catch(e) {
      return reject(e);
    }
    
    return resolve(response.result);
  });
};

module.exports = createPromoteOrder;