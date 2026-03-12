import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, refreshUserToken, registerUser } from "./auth.service";
import { successResponse } from "../../utils/response";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await registerUser(body);
    return successResponse(res, "Register successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await loginUser(body.email, body.password);
    return successResponse(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshUserToken(refreshToken);
    return successResponse(res, "Refresh token successful", result);
  } catch (error) {
    next(error);
  }
};