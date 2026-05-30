import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import subscriptionsRouter from "./subscriptions";
import checkoutIntentsRouter from "./checkoutIntents";
import productsRouter from "./products";
import siteContentRouter from "./siteContent";
import adminLoginRouter from "./adminLogin";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(subscriptionsRouter);
router.use(checkoutIntentsRouter);
router.use(productsRouter);
router.use(siteContentRouter);
router.use(adminLoginRouter);
router.use(uploadRouter);

export default router;
