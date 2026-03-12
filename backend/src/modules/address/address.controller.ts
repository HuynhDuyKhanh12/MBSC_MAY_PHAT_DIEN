import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createAddressService,
  deleteAddressService,
  getAddressesService,
  updateAddressService,
} from "./address.service";
import { successResponse } from "../../utils/response";

export const createAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      fullName,
      phone,
      province,
      district,
      ward,
      detailAddress,
      postalCode,
      isDefault,
    } = req.body;

    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone || !String(phone).trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    if (!province || !String(province).trim()) {
      return res.status(400).json({
        success: false,
        message: "Province is required",
      });
    }

    if (!district || !String(district).trim()) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    if (!ward || !String(ward).trim()) {
      return res.status(400).json({
        success: false,
        message: "Ward is required",
      });
    }

    if (!detailAddress || !String(detailAddress).trim()) {
      return res.status(400).json({
        success: false,
        message: "Detail address is required",
      });
    }

    const result = await createAddressService(req.user.id, {
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      province: String(province).trim(),
      district: String(district).trim(),
      ward: String(ward).trim(),
      detailAddress: String(detailAddress).trim(),
      postalCode: postalCode !== undefined ? String(postalCode).trim() : undefined,
      isDefault,
    });

    return successResponse(res, "Create address successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAddressesService(req.user.id);
    return successResponse(res, "Get addresses successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Address id is invalid",
      });
    }

    const result = await updateAddressService(req.user.id, id, req.body);
    return successResponse(res, "Update address successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Address id is invalid",
      });
    }

    const result = await deleteAddressService(req.user.id, id);
    return successResponse(res, "Delete address successful", result);
  } catch (error) {
    next(error);
  }
};