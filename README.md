## API for Payments
[![api.russell.work/payments](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fbadge%3Dhttps%3A%2F%2Fapi.russell.work/payments)](https://api.russell.work/payments)
[![api.russell.work/payments](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.russell.work%2Fserver_status%3Fuptimes%3D1%26badge%3Dhttps%3A%2F%2Fapi.russell.work/payments)](https://api.russell.work/payments)

### `POST /payments`

Data format: 

    const data = {owner: "emerson.cloud@gmail.com", event: "Corner Cup", peopleToCharge: [{"name": "russell", "amount": 20},{"name": "kyle", "amount": 5}]
    
    submitData = (data) => {
    const url = 'https://api.russell.work'
    
    const resp = await fetch(`${url}/payments`, {method: 'POST', body: JSON.stringify(data}})
    }

### `GET /payments`

    const url = 'https://api.russell.work'
    const resp = await fetch(`${url}/payments`)
    const data = await resp.json()
    console.log(data)
