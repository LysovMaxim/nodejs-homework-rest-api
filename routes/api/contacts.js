const express = require("express");
const {
  Contact,
  addSchema,
  updateFavoriteShema,
} = require("../../models/contact");
const { isValidId, authenticate } = require("../../maddlewares");

const router = express.Router();

const { HttpError } = require("../../helpers");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email subscription");
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authenticate, isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing required name field");
    }
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await Contact.findByIdAndRemove(contactId);
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json({
        massage: "Contact deleted",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:contactId", authenticate, isValidId, async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing fields");
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  async (req, res, next) => {
    try {
      const { error } = updateFavoriteShema.validate(req.body);
      if (error) {
        throw HttpError(400, "missing fields");
      }
      const { contactId } = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
      });
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
