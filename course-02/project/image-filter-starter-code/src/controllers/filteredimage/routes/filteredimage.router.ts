import { Router, Request, Response } from "express";
import { requireAuth } from "../../../controllers/auth/auth";
import {
  filterImageFromURL,
  deleteLocalFiles,
  isValidImageUrl,
} from "../../../util/util";

const router: Router = Router();

//authenticate all request
router.use(requireAuth);

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */
router.get("/", async (req: Request, res: Response) => {
  let { image_url } = req.query;

  if (!image_url) {
    return res.status(400).send("image_url is required");
  }

  const isImageUrlValid = await isValidImageUrl(image_url);
  if (!isImageUrlValid) {
    return res.status(422).send("image_url is not valid");
  }

  try {
    const filtered_image_path = await filterImageFromURL(image_url);
    res.sendFile(filtered_image_path, (error) => {
      deleteLocalFiles([filtered_image_path]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldnt process image");
  }
});
//! END @TODO1

export const FilteredImageRouter: Router = router;
