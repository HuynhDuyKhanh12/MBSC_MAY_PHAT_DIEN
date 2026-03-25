import { prisma } from "../../config/prisma";
import { ServiceRequestStatus, ServiceType, Prisma } from "@prisma/client";

const generateServiceCode = () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SR${y}${m}${d}${random}`;
};

export const createServiceRequest = async (userId: number, payload: any) => {
  const code = generateServiceCode();

  return prisma.serviceRequest.create({
    data: {
      code,
      userId,
      type: payload.type as ServiceType,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail || null,
      province: payload.province,
      district: payload.district,
      ward: payload.ward,
      detailAddress: payload.detailAddress,
      productName: payload.productName,
      productModel: payload.productModel || null,
      serialNumber: payload.serialNumber || null,
      purchaseDate: payload.purchaseDate ? new Date(payload.purchaseDate) : null,
      warrantyExpiry: payload.warrantyExpiry ? new Date(payload.warrantyExpiry) : null,
      issueTitle: payload.issueTitle,
      issueDescription: payload.issueDescription || null,
      preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
      preferredTimeSlot: payload.preferredTimeSlot || null,
      images: {
        create: (payload.imageUrls || []).map((imageUrl: string, index: number) => ({
          imageUrl,
          sortOrder: index,
        })),
      },
      logs: {
        create: {
          userId,
          action: "CREATE_SERVICE_REQUEST",
          oldStatus: null,
          newStatus: "PENDING",
          note: "Khách hàng tạo yêu cầu bảo dưỡng / sửa chữa",
        },
      },
    },
    include: {
      images: true,
      logs: true,
    },
  });
};

export const getAllServiceRequests = async (query: {
  status?: ServiceRequestStatus;
  type?: ServiceType;
  keyword?: string;
  page: number;
  limit: number;
}) => {
  const { status, type, keyword, page, limit } = query;

  const where: Prisma.ServiceRequestWhereInput = {
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(keyword
      ? {
          OR: [
            { code: { contains: keyword } },
            { customerName: { contains: keyword } },
            { customerPhone: { contains: keyword } },
            { productName: { contains: keyword } },
            { issueTitle: { contains: keyword } },
            { serialNumber: { contains: keyword } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      include: {
        customer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        assignedTo: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        images: true,
        logs: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.serviceRequest.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getServiceRequestById = async (id: number) => {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      assignedTo: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      images: true,
      logs: { orderBy: { createdAt: "desc" } },
    },
  });
};

export const getMyServiceRequests = async (userId: number) => {
  return prisma.serviceRequest.findMany({
    where: { userId },
    include: {
      assignedTo: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      images: true,
      logs: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAssignedServiceRequests = async (assignedToId: number) => {
  return prisma.serviceRequest.findMany({
    where: { assignedToId },
    include: {
      customer: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      images: true,
      logs: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateServiceRequest = async (
  id: number,
  currentUserId: number,
  payload: any
) => {
  const current = await prisma.serviceRequest.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!current) {
    throw new Error("Không tìm thấy phiếu yêu cầu");
  }

  return prisma.$transaction(async (tx) => {
    if (payload.imageUrls) {
      await tx.serviceRequestImage.deleteMany({
        where: { serviceRequestId: id },
      });
    }

    const updated = await tx.serviceRequest.update({
      where: { id },
      data: {
        ...(payload.type ? { type: payload.type as ServiceType } : {}),
        ...(payload.customerName !== undefined ? { customerName: payload.customerName } : {}),
        ...(payload.customerPhone !== undefined ? { customerPhone: payload.customerPhone } : {}),
        ...(payload.customerEmail !== undefined
          ? { customerEmail: payload.customerEmail || null }
          : {}),
        ...(payload.province !== undefined ? { province: payload.province } : {}),
        ...(payload.district !== undefined ? { district: payload.district } : {}),
        ...(payload.ward !== undefined ? { ward: payload.ward } : {}),
        ...(payload.detailAddress !== undefined ? { detailAddress: payload.detailAddress } : {}),
        ...(payload.productName !== undefined ? { productName: payload.productName } : {}),
        ...(payload.productModel !== undefined ? { productModel: payload.productModel || null } : {}),
        ...(payload.serialNumber !== undefined ? { serialNumber: payload.serialNumber || null } : {}),
        ...(payload.purchaseDate !== undefined
          ? { purchaseDate: payload.purchaseDate ? new Date(payload.purchaseDate) : null }
          : {}),
        ...(payload.warrantyExpiry !== undefined
          ? { warrantyExpiry: payload.warrantyExpiry ? new Date(payload.warrantyExpiry) : null }
          : {}),
        ...(payload.issueTitle !== undefined ? { issueTitle: payload.issueTitle } : {}),
        ...(payload.issueDescription !== undefined
          ? { issueDescription: payload.issueDescription || null }
          : {}),
        ...(payload.preferredDate !== undefined
          ? { preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null }
          : {}),
        ...(payload.preferredTimeSlot !== undefined
          ? { preferredTimeSlot: payload.preferredTimeSlot || null }
          : {}),
        ...(payload.imageUrls
          ? {
              images: {
                create: payload.imageUrls.map((imageUrl: string, index: number) => ({
                  imageUrl,
                  sortOrder: index,
                })),
              },
            }
          : {}),
      },
      include: {
        customer: true,
        assignedTo: true,
        images: true,
      },
    });

    await tx.serviceRequestLog.create({
      data: {
        serviceRequestId: id,
        userId: currentUserId,
        action: "UPDATE_SERVICE_REQUEST",
        oldStatus: current.status,
        newStatus: current.status,
        note: "Cập nhật thông tin phiếu",
      },
    });

    return updated;
  });
};

export const deleteServiceRequest = async (id: number, currentUserId: number) => {
  const current = await prisma.serviceRequest.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Không tìm thấy phiếu yêu cầu");
  }

  return prisma.$transaction(async (tx) => {
    await tx.serviceRequestLog.create({
      data: {
        serviceRequestId: id,
        userId: currentUserId,
        action: "DELETE_SERVICE_REQUEST",
        oldStatus: current.status,
        newStatus: current.status,
        note: "Xóa phiếu yêu cầu",
      },
    });

    await tx.serviceRequestImage.deleteMany({
      where: { serviceRequestId: id },
    });

    await tx.serviceRequest.delete({
      where: { id },
    });

    return true;
  });
};

export const assignTechnician = async (
  id: number,
  assignedToId: number,
  currentUserId: number,
  note?: string
) => {
  const technician = await prisma.user.findUnique({
    where: { id: assignedToId },
    include: { role: true },
  });

  if (!technician) {
    throw new Error("Nhân viên không tồn tại");
  }

  if (technician.role.name !== "TECHNICIAN") {
    throw new Error("User được chọn không phải nhân viên bảo quản / sửa chữa");
  }

  const current = await prisma.serviceRequest.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Không tìm thấy phiếu yêu cầu");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.serviceRequest.update({
      where: { id },
      data: {
        assignedToId,
        status: "ASSIGNED",
      },
      include: {
        customer: true,
        assignedTo: true,
        images: true,
      },
    });

    await tx.serviceRequestLog.create({
      data: {
        serviceRequestId: id,
        userId: currentUserId,
        action: "ASSIGN_TECHNICIAN",
        oldStatus: current.status,
        newStatus: "ASSIGNED",
        note: note || `Phân công nhân viên #${assignedToId}`,
      },
    });

    return updated;
  });
};

export const updateServiceRequestStatus = async (
  id: number,
  currentUserId: number,
  payload: {
    status: ServiceRequestStatus;
    note?: string;
    visitFee?: number;
    repairFee?: number;
    totalFee?: number;
  }
) => {
  const current = await prisma.serviceRequest.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Không tìm thấy phiếu yêu cầu");
  }

  const data: any = {
    status: payload.status,
  };

  if (payload.note !== undefined) data.note = payload.note;
  if (payload.visitFee !== undefined) data.visitFee = payload.visitFee;
  if (payload.repairFee !== undefined) data.repairFee = payload.repairFee;
  if (payload.totalFee !== undefined) data.totalFee = payload.totalFee;

  if (payload.status === "COMPLETED") {
    data.completedAt = new Date();
  }

  if (payload.status === "CANCELLED") {
    data.cancelledAt = new Date();
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.serviceRequest.update({
      where: { id },
      data,
      include: {
        customer: true,
        assignedTo: true,
        images: true,
      },
    });

    await tx.serviceRequestLog.create({
      data: {
        serviceRequestId: id,
        userId: currentUserId,
        action: "UPDATE_SERVICE_STATUS",
        oldStatus: current.status,
        newStatus: payload.status,
        note: payload.note || `Cập nhật trạng thái sang ${payload.status}`,
      },
    });

    return updated;
  });
};