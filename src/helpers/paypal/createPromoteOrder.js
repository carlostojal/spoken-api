const paypal = require("@paypal/checkout-server-sdk");

const createPromoteOrder = (post) => {
  return new Promise(async (resolve, reject) => {
    const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    const client = new paypal.core.PayPalHttpClient(environment);

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      "intent": "AUTHORIZE",
      "purchase_units": [
        {
          "reference_id": post.id,
          "description": `Spoken Post Promotion`,
          "amount": {
            "currency_code": process.env.POST_PROMOTION_CURRENCY,
            "value": process.env.POST_PROMOTION_BASE_COST,
            "breakdown": {
              "item_total": {
                "currency_code": process.env.POST_PROMOTION_CURRENCY,
                "value": process.env.POST_PROMOTION_BASE_COST
              }
            }
          },
          "items": [
            {
              "name": "Base promotion",
              "description": `Promotion on post with text \"${post.text.substring(0, 10)}${post.text.length > 10 ? "..." : ""}\".`,
              "unit_amount": {
                "currency_code": process.env.POST_PROMOTION_CURRENCY,
                "value": process.env.POST_PROMOTION_BASE_COST
              },
              "quantity": "1"
            }
          ]
        }
      ],
      "application_context": {
        "user_action": "CONTINUE",
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