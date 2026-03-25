import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as serviceRequestService from "./service-request.service";
import {
  assignTechnicianSchema,
  createServiceRequestSchema,
  serviceRequestQuerySchema,
  updateServiceRequestSchema,
  updateServiceRequestStatusSchema,
} from "./service-request.validation";

export const createServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createServiceRequestSchema.parse(req.body);

    const result = await serviceRequestService.createServiceRequest(
      req.user.id,
      parsed
    );

    return res.status(201).json({
      success: true,
      message: "Tạo phiếu thành công",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Tạo phiếu thất bại",
      error,
    });
  }
};

export const getAllServiceRequests = async (req: AuthRequest, res: Response) => {
  try {
    const query = serviceRequestQuerySchema.parse(req.query);
    const result = await serviceRequestService.getAllServiceRequests(query);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Lấy danh sách phiếu thất bại",
    });
  }
};

export const getMyServiceRequests = async (req: AuthRequest, res: Response) => {
  try {
    const result = await serviceRequestService.getMyServiceRequests(req.user.id);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Lấy phiếu của tôi thất bại",
    });
  }
};

export const getAssignedServiceRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await serviceRequestService.getAssignedServiceRequests(
      req.user.id
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Lấy phiếu được giao thất bại",
    });
  }
};

export const getServiceRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await serviceRequestService.getServiceRequestById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiếu",
      });
    }

    if (req.user.role === "CUSTOMER" && result.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem phiếu này",
      });
    }

    if (req.user.role === "TECHNICIAN" && result.assignedToId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem phiếu này",
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Lấy chi tiết phiếu thất bại",
    });
  }
};

export const updateServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const parsed = updateServiceRequestSchema.parse(req.body);

    const result = await serviceRequestService.updateServiceRequest(
      id,
      req.user.id,
      parsed
    );

    return res.json({
      success: true,
      message: "Cập nhật phiếu thành công",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Cập nhật phiếu thất bại",
      error,
    });
  }
};

export const deleteServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await serviceRequestService.deleteServiceRequest(id, req.user.id);

    return res.json({
      success: true,
      message: "Xóa phiếu thành công",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Xóa phiếu thất bại",
      error,
    });
  }
};

export const assignTechnician = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const parsed = assignTechnicianSchema.parse(req.body);

    const result = await serviceRequestService.assignTechnician(
      id,
      parsed.assignedToId,
      req.user.id,
      parsed.note
    );

    return res.json({
      success: true,
      message: "Phân công nhân viên thành công",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Phân công thất bại",
      error,
    });
  }
};

export const updateServiceRequestStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const parsed = updateServiceRequestStatusSchema.parse(req.body);

    const serviceRequest = await serviceRequestService.getServiceRequestById(id);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiếu",
      });
    }

    if (
      req.user.role === "TECHNICIAN" &&
      serviceRequest.assignedToId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không được cập nhật phiếu không thuộc mình",
      });
    }

    const result = await serviceRequestService.updateServiceRequestStatus(
      id,
      req.user.id,
      parsed
    );

    return res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Cập nhật trạng thái thất bại",
      error,
    });
  }
};