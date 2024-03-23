const { mongoose } = require("mongoose");

module.exports = async () => {
    console.log('Started connecting to MongoDB...');

    // await connect(process.env.MONGO_DB).then(() => {
    //     console.log('MongoDB is connected to the atlas!')
    // });

    mongoose.set('strictQuery', true); // Remove dep warning
    mongoose.connect(process.env.MONGO_DB)
};