import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createAddressService,
  deleteAddressService,
  getAddressesService,
  updateAddressService,
} from "./address.service";
import { successResponse } from "../../utils/response";

export const createAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await createAddressService(req.user.id, req.body);
    return successResponse(res, "Create address successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getAddressesService(req.user.id);
    return successResponse(res, "Get addresses successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await updateAddressService(req.user.id, Number(req.params.id), req.body);
    return successResponse(res, "Update address successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await deleteAddressService(Number(req.params.id));
    return successResponse(res, "Delete address successful", result);
  } catch (error) {
    next(error);
  }
};