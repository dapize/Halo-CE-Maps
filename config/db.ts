import mongoose from 'mongoose';
import Logger from 'jet-logger';

const connect = ( uri: string ) => {
  mongoose.connect(
    uri,
    {
      keepAlive: true
    },
    ( err ) => {
      if ( err ) {
        Logger.err('Error connecting to the DB');
        return Logger.err(err)
      }
      Logger.info('¡DB connection successfully!')
    }
  )

  return mongoose;
}

export default connect;
