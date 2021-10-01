import express from 'express';
import homeDepot from './homeDepot.js';
import samsClub from './samsClub.js';
import zoro from './zoro.js';
import walmart from './walmart.js';

const rootRouter = express.Router();

rootRouter.use('/homeDepot', homeDepot);
rootRouter.use('/samsClub', samsClub);
rootRouter.use('/zoro', zoro);
rootRouter.use('/walmart', walmart);

export default rootRouter;
