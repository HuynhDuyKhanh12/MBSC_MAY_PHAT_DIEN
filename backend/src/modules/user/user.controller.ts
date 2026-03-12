import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  changePasswordService,
  deleteUserService,
  getProfileService,
  getUsersService,
  updateProfileService,
} from "./user.service";
import { successResponse } from "../../utils/response";

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getUsersService();
    return successResponse(res, "Get users successful", result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getProfileService(req.user.id);
    return successResponse(res, "Get profile successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await updateProfileService(req.user.id, req.body);
    return successResponse(res, "Update profile successful", result);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await changePasswordService(req.user.id, req.body.newPassword);
    return successResponse(res, "Change password successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteUserService(Number(req.params.id));
    return successResponse(res, "Delete user successful", result);
  } catch (error) {
    next(error);
  }
};