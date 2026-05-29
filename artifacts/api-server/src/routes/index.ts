import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import subscriptionsRouter from "./subscriptions";
import checkoutIntentsRouter from "./checkoutIntents";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(subscriptionsRouter);
router.use(checkoutIntentsRouter);

export default router;
