import axios from "axios";

const { CLIENT_ID = "", APP_SECRET = "", URL_BASE, NODE_ENV, PORT = 3001 } = process.env;

export const HOST =
  NODE_ENV === "production"
    ? process.env.HOST
    : "http://localhost:" + PORT;


const generateAccessToken = async() => {
    const auth = {
        username: CLIENT_ID,
        password: APP_SECRET,
      }
    const url = `${URL_BASE}/v1/oauth2/token`
   const { data: { access_token }} = await axios.post(url, {
        grant_type: 'client_credentials',
      }, {
        auth,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
    })

    return access_token
}


export async function handleResponse(response: any) {
    if (response.status === 200 || response.status === 201) {
        return response.data
    }
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

export async function capturePayment(orderID: string): Promise<any> {
    const token = await generateAccessToken()
    const response = await axios.post(`${URL_BASE}/v2/checkout/orders/${orderID}/capture`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export async function createOrder() {
try {
    
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "BRL",
            value: "105.70",
          },
        },
      ],
      application_context: {
        brand_name: "mycompany.com",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,
        cancel_url: `${HOST}/cancel-payment`,
      },
    };

    const token = await generateAccessToken()

    const response = await axios.post(
      `${URL_BASE}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return handleResponse(response)
}
    catch(error) {
        return error
    }
}


export default { createOrder, capturePayment }