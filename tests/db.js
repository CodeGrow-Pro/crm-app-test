const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongod;

exports.connect = async () => {
    if(!mongod){
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const options = {
            maxPoolSize: 30
        }
        mongoose.connect(uri, options);
    }
}

exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if(mongod){
        mongod.stop();
    }
}

exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for(let key in collections){
        const collection = collections[key];
        // wait for cleanup: MongoPoolClosedError: Attempted to check out a connection from closed connection pool
        await collection.deleteMany();
    }
}