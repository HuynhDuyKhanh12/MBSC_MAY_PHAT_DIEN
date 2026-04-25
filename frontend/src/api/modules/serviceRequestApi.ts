import axiosClient from "../axiosClient";

export type ServiceRequestStatus =
  | "PENDING"
  | "RECEIVED"
  | "ASSIGNED"
  | "INSPECTING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type ServiceType = "MAINTENANCE" | "REPAIR";

export const getServiceRequestsApi = async (params?: {
  keyword?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosClient.get("/service-requests", { params });
  return res.data;
};

export const getServiceRequestByIdApi = async (id: number | string) => {
  const res = await axiosClient.get(`/service-requests/${id}`);
  return res.data;
};

export const updateServiceRequestApi = async (id: number | string, payload: any) => {
  const res = await axiosClient.put(`/service-requests/${id}`, payload);
  return res.data;
};

export const deleteServiceRequestApi = async (id: number | string) => {
  const res = await axiosClient.delete(`/service-requests/${id}`);
  return res.data;
};

export const updateServiceRequestStatusApi = async (
  id: number | string,
  payload: {
    status: ServiceRequestStatus;
    note?: string;
    visitFee?: number;
    repairFee?: number;
    totalFee?: number;
  }
) => {
  const res = await axiosClient.patch(`/service-requests/${id}/status`, payload);
  return res.data;
};

export const assignTechnicianApi = async (
  id: number | string,
  payload: { assignedToId: number; note?: string }
) => {
  const res = await axiosClient.patch(`/service-requests/${id}/assign`, payload);
  return res.data;
};