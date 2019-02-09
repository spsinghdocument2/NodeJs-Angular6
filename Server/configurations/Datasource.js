  // var options = {
  //     user: 'supersuser',
  //     pass: 'xyz
  // };

  var getDbConnection = function() {
      // switch (process.env.NODE_ENV) {
      //     case 'development':
      var db = mongoose.connect('mongodb://localhost:27017/database');
               return checkMongooseConnection(db)

      //     case 'production':
      //         var db = mongoose.connect('mongodb://localhost/xyz', options);
      //         return checkMongooseConnection(db)

      //     default:
      //         var db = mongoose.connect('mongodb://localhost/xyz');
      //         return checkMongooseConnection(db)
      // }

     
  }


  //function to check connection to database server
  function checkMongooseConnection(db) {
      // CONNECTION EVENTS
      // When successfully connected
      mongoose.connection.on('connected', function () {
          console.log('Mongoose default connection open to ');
      });
      mongoose.connection.on('open', function (ref) {
           console.log('Connected to mongo server.');
           return db
       });
      // If the connection throws an error
       mongoose.connection.on('error', function (error) {
           console.log('Could not connect to mongo server!');
           configurationHolder.Logger.error('Error in configuration Datasource connection error Method' + error + '\r\n');
       });
      // When the connection is disconnected
       mongoose.connection.on('disconnected', function () {
           console.log('Mongoose default connection disconnected');
           configurationHolder.Logger.error('Error in configuration Datasource connection disconnected Method' + '\r\n');
       });
   }


  module.exports.getDbConnection = getDbConnection;
