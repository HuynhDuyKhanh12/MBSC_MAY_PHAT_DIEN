import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import "./order.css";

type OrderStatus = "pending" | "shipping" | "done" | "cancelled";

type OrderItem = {
  id: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  orderName: string;
  total: number;
  status: OrderStatus;
};

const STORAGE_KEY = "admin_orders";

const defaultOrders: OrderItem[] = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Khanh",
    email: "khanh@gmail.com",
    phone: "0911111111",
    orderName: "Đơn Honda",
    total: 500000,
    status: "pending",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Lan",
    email: "lan@gmail.com",
    phone: "0988888888",
    orderName: "Đơn Yamaha",
    total: 1500000,
    status: "shipping",
  },
];

function getOrders(): OrderItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }
}

function saveOrders(data: OrderItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    let data = getOrders();

    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.email.toLowerCase().includes(s) ||
          i.phone.includes(s) ||
          i.orderName.toLowerCase().includes(s) ||
          String(i.id).includes(s)
      );
    }

    if (statusFilter) {
      data = data.filter((i) => i.status === statusFilter);
    }

    setOrders(data);
  };

  useEffect(() => {
    load();
  }, [search, statusFilter]);

  const formatMoney = (n: number) => n.toLocaleString("vi-VN") + " VND";

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "shipping":
        return "Đang giao hàng";
      case "done":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "";
    }
  };

  const changeStatus = (id: number, status: OrderStatus) => {
    const updated = getOrders().map((i) =>
      i.id === id ? { ...i, status } : i
    );
    saveOrders(updated);
    load();
  };

  const cancel = (id: number) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

    const updated = getOrders().map((i) =>
      i.id === id ? { ...i, status: "cancelled" } : i
    );
    saveOrders(updated);
    load();
  };

  return (
    <div className="order-page">
      <div className="toolbar">
        <span className="toolbar-label">Lọc theo:</span>

        <input
          placeholder="Tìm kiếm đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="shipping">Đang giao hàng</option>
          <option value="done">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <button className="btn-search">Tìm kiếm</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Tên đơn hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>ID</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-cell">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              orders.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <img src={item.image} alt={item.name} className="avatar" />
                  </td>

                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.orderName}</td>
                  <td>{formatMoney(item.total)}</td>

                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        changeStatus(item.id, e.target.value as OrderStatus)
                      }
                      className="status"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="done">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>

                    <div className="status-text">
                      {getStatusLabel(item.status)}
                    </div>
                  </td>

                  <td>{item.id}</td>

                  <td>
                    <div className="actions">
                      <button
                        className="btn view"
                        onClick={() => navigate(`/admin/order/view/${item.id}`)}
                        title="Xem"
                      >
                        <FaEye size={16} />
                      </button>

                      <button
                        className="btn edit"
                        onClick={() => navigate(`/admin/order/edit/${item.id}`)}
                        title="Sửa"
                      >
                        <FaPen size={16} />
                      </button>

                      <button
                        className="btn delete"
                        onClick={() => cancel(item.id)}
                        title="Hủy đơn"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}