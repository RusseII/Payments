/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.RUSSELL_WORK_MONGODB_URI;

let cachedDb = null;
const timestamp = () => new Date().toString();

async function connectToDatabase() {
  const uri = MONGODB_URI;
  console.log('=> connect to database');

  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }

  const connection = await MongoClient.connect(uri);
  console.log('=> creating a new connection');
  cachedDb = connection.db('russell_work');
  return Promise.resolve(cachedDb);
}

async function getSummaries(db, owner) {
  console.log('=> query database');

  const payments = await db
    .collection('payment_tracker')
    .find({
      owner,
    })
    .toArray()
    .catch(err => {
      console.log('=> an error occurred: ', err);
      return { statusCode: 500, body: 'error adding to mongodb' };
    });

  const summary = {};
  payments.forEach(charge => {
    charge.peopleToCharge.forEach(person => {
      const { name, amount } = person;
      console.log("a:", amount)
      let amountAsNum = Number.parseFloat(amount)
      let lowerName = name.toLowerCase()
      if (amountAsNum) {
        console.log("a2:", amountAsNum)
      summary[lowerName] ? (summary[lowerName] += amountAsNum) : (summary[lowerName] = amountAsNum);
      }
    });
  });
  return summary;
}

async function submitCharge(db, data) {
  console.log('=> submit charge');

  const insertInLog = await db
    .collection('payment_tracker_log')
    .insertOne({ timestamp: timestamp(), ...data })
    .catch(err => {
      console.log('=> an error occurred: ', err);
      return { statusCode: 500, body: 'error adding to mongodb' };
    });

  const insertData = await db
    .collection('payment_tracker')
    .insertOne({ timestamp: timestamp(), ...data })
    .catch(err => {
      console.log('=> an error occurred: ', err);
      return { statusCode: 500, body: 'error adding to mongodb' };
    });

  return { statusCode: 200, body: 'submitted charges' };
}

const executeMongo = async (event, context, callback) => {
  console.log(event);
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase();
  if (event.httpMethod === 'GET') {
    const name = 'emerson.cloud@gmail.com';
    const data = await getSummaries(db, name);
    const resp = { statusCode: 200, body: JSON.stringify(data) };
    callback(null, resp);
  }

  if (event.httpMethod === 'POST') {
    let body = {};
    if (event.body !== null && event.body !== undefined) {
      body = JSON.parse(event.body);
    }
    const resp = await submitCharge(db, body);
    callback(null, resp);
  }
};

module.exports.handler = executeMongo;

// executeMongo({body: {city: 'Hammondsville', state: "Ohio"}}, {}, {})
