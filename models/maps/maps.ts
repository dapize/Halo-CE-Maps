import { IMap } from './maps.d';
import { Schema, model } from 'mongoose';

const mapsSchema = new Schema<IMap>(
  {
    name: {
      type: String,
      required: true
    },
    downloads: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const mapsModel = model<IMap>('maps', mapsSchema);

export default mapsModel;
