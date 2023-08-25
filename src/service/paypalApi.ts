import fetch from "axios";

const { CLIENT_ID = "", APP_SECRET = "", URL_BASE, NODE_ENV } = process.env;

import paypal from "@paypal/checkout-server-sdk"

const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    CLIENT_ID as string,
    APP_SECRET as string
  )
)


export async function handleResponse(response: any) {
    if (response.status === 200 || response.status === 201) {
        return response.json()
    }
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

export async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
    const url = `${URL_BASE}/v1/oauth2/token`;
    const response = await fetch(url, {
        method: "post",
        data: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
    
}

export async function createOrder() {
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": "100.00"
                }
            }
         ]
    });
    try {
        const order = await paypalClient.execute(request)
        console.log(order)
        return order
      } catch (error) {
        return error
      }
    }

export async function capturePayment(orderID: string): Promise<any> {
    const accessToken  = await generateAccessToken();
    const response = await fetch(`${URL_BASE}/v2/checkout/orders/${orderID}/capture`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return handleResponse(response)
}

export default { createOrder, capturePayment}