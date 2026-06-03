import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import subscriptionsRouter from "./subscriptions";
import checkoutIntentsRouter from "./checkoutIntents";
import productsRouter from "./products";
import siteContentRouter from "./siteContent";
import adminLoginRouter from "./adminLogin";
import uploadRouter from "./upload";
import seedRouter from "./seed";
import fxRatesRouter from "./fxRates";
import locationRouter from "./location";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(subscriptionsRouter);
router.use(checkoutIntentsRouter);
router.use(productsRouter);
router.use(siteContentRouter);
router.use(adminLoginRouter);
router.use(uploadRouter);
router.use(seedRouter);
router.use(fxRatesRouter);
router.use(locationRouter);

export default router;
