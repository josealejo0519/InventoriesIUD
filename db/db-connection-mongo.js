const mongoose = require('mongoose');

const getConnection = async () => {

    try {
        const url = 'mongodb://oliverosJoseA:h8BZYkAnM4SY7IYR@ac-mv4s6ce-shard-00-00.jzmrkue.mongodb.net:27017,ac-mv4s6ce-shard-00-01.jzmrkue.mongodb.net:27017,ac-mv4s6ce-shard-00-02.jzmrkue.mongodb.net:27017/inventarios-2024-28?ssl=true&replicaSet=atlas-63q3z2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

        await mongoose.connect(url);

        console.log('Connected')

    } catch (error) {
        console.log(error)
    }


}

module.exports = {
    getConnection
}