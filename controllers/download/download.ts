import { Request, Response } from "express";
import mapsModel from '@models/maps'
import { resolve } from "path";
import { readdir } from "fs/promises";
import { IMap } from './download.d';

let mapsList:IMap[] = [];
export default async function ( request: Request, res: Response ) {
  let mapName = request.path.replace('/', '');
  const mapsPath = resolve(__basedir, './public/maps')
  let filePath = mapsPath + '/' +  mapName;

  const getFromChimera = request.headers['user-agent']?.toLowerCase().includes('chimera');
  if ( getFromChimera ) {
    if ( !mapsList.length ) {
      const maps = await readdir(mapsPath);
      mapsList = maps.map( map => ({
        realName: map,
        chimeraName: map.toLowerCase()
      }))
    }
    mapName = decodeURIComponent(mapName) + '.zip';
    const findMap = mapsList.find( ( map: IMap ) => map.chimeraName === mapName );
    if ( findMap ) filePath = mapsPath + '/' + decodeURIComponent(findMap.realName.replace('.zip', '.map'));
  }

  res.download(filePath, mapName, async (err) => {
    if ( err ) {
      console.log(mapName);
      console.log(err);
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
