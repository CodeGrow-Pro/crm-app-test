const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongod;

exports.connect = async () => {
    if(!mongod){
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    }
}

exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if(mongod){
        await mongod.stop();
    }
}

exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
}