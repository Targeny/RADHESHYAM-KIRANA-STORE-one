const mongoose = require('mongoose');
const uri = 'mongodb+srv://admin:BlinkitAdmin%40123@cluster0.dncdhhv.mongodb.net/blinkit-admin?appName=Cluster0';
mongoose.connect(uri)
  .then(() => { console.log('Connected correctly!'); process.exit(0); })
  .catch(err => { console.error('Error:', err); process.exit(1); });
