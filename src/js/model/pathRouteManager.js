import {map1Path1Route1, map1Path1Route2, map1Path1Route3 } from './map1/Map1Paths.js';
import {map2Path1Route1, map2Path1Route2, map2Path1Route3, map2Path2Route1} from './map2/Map2Paths.js';
import {
        map3Path1Route1,
        map3Path1Route2,
        map3Path1Route3,
        map3Path1Route4,
        map3Path1Route5,
        map3Path2Route1
} from './map3/Map3Paths.js';

/**
 * Object to hold the paths for the map1.
 * @type {{Route1: [{x: number, y: number},{x: number, y: number}]}}; - the path for the first route on map1.
 * @author Philip, Muhamed
 */
export const Map1Paths = {
        Route1: map1Path1Route1,
        Route2: map1Path1Route2,
        Route3: map1Path1Route3
}

/**
 * Object to hold the paths for the map2.
 * @type {{map2Path1Route1: [{x: number, y: number},{x: number, y: number}]}} - the path for the first route on map2.
 * @author Philip, Muhamed
 */
export const Map2Paths = {
        map2Path1Route1,
        map2Path1Route2,
        map2Path1Route3,
        map2Path2Route1,
}

/**
 * Object to hold the paths for the map3.
 * @type {{map3Path1Route1: [{x: number, y: number},{x: number, y: number}]}} - the path for the first route on map3.
 * @author Muhamed
 */
export const Map3Paths = {
        map3Path1Route1,
        map3Path1Route2,
        map3Path1Route3,
        map3Path1Route4,
        map3Path1Route5,
        map3Path2Route1,
}
