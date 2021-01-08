import { Router, Request, Response } from "express";
import { FilteredImageRouter } from "./filteredimage/routes/filteredimage.router";

const router: Router = Router();

router.use("/filteredimage", FilteredImageRouter);

// Root Endpoint
// Displays a simple message to the user
router.get("/", async (req: Request, res: Response) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

export const IndexRouter: Router = router;
