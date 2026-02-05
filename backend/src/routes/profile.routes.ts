import { Router } from "express";
import { updateProfile, uploadPhoto, deletePhoto } from "../controllers/profile.controller.js";
import { upload } from "../utils/upload.js";

export const profileRouter = Router();

profileRouter.post("/", updateProfile);
profileRouter.post("/photo", upload.single("photo"), uploadPhoto);
profileRouter.delete("/photo", deletePhoto);
