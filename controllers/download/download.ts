import { Request, Response } from "express";
import mapsModel from '@models/maps'
import { resolve } from "path";

export default function ( request: Request, res: Response ) {
  let mapName = request.path;
  const filePath = resolve(__basedir, './public/maps/' + mapName);
  res.download(filePath, mapName, async (err) => {
    if ( err ) {
      res.status(404);
      return;
    }
    try {
      mapName = mapName.substring(1).replace('.zip', '');
      const findMap = await mapsModel.findOne({ name: mapName }, { _id: true });
      if ( !findMap ) {
        await mapsModel.create({ name: mapName })
      } else {
        await mapsModel.updateOne(
          { _id: findMap._id},
          { $inc: { downloads: 1 }}
        )
      }
    } catch( cError ) {
      console.log( cError );
    }
  });
}
