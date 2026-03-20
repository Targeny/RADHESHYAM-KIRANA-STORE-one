const mongoose = require('mongoose');
const uri = 'mongodb://admin:BlinkitAdmin%40123@ac-aj4r7zu-shard-00-00.dncdhhv.mongodb.net:27017,ac-aj4r7zu-shard-00-01.dncdhhv.mongodb.net:27017,ac-aj4r7zu-shard-00-02.dncdhhv.mongodb.net:27017/blinkit-admin?tls=true&replicaSet=atlas-aj4r7zu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
console.log('Testing connection...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => { console.log('SUCCESS'); process.exit(0); })
  .catch(err => { console.error('FAIL:', err.message); process.exit(1); });
