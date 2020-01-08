## `POST /payments`

Data format: 

    const data = {owner: "emerson.cloud@gmail.com", event: "Corner Cup", peopleToCharge: [{"name": "russell", "amount": 20},{"name": "kyle", "amount": 5}]
    
    submitData = (data) => {
    const url = 'https://api.russell.work'
    
    const resp = await fetch(`${url}/payments`, {method: 'POST', body: JSON.stringify(data}})
    }

`GET /payments`

    const url = 'https://api.russell.work'
    const resp = await fetch(`${url}/payments`)
    const data = await resp.json()
    console.log(data)
