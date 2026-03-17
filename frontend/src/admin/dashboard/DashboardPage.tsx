import { FaBoxOpen, FaListUl, FaTags, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";

type TopFood = {
  id: number;
  image: string;
  name: string;
  reviews: number;
};

export default function DashboardPage() {
  const topFoods: TopFood[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop",
      name: "Salad rau mùa sốt mắc mác",
      reviews: 4,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
      name: "Salad rau mùa sốt cam",
      reviews: 3,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop",
      name: "Phở cuốn",
      reviews: 3,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop",
      name: "Gỏi tai heo hoa chuối",
      reviews: 2,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=300&auto=format&fit=crop",
      name: "Canh tiềm bổ dưỡng",
      reviews: 2,
    },
  ];

  return (
    <div className="dashboardPage">
      <div className="dashboardHead">
        <h1 className="dashboardTitle">Dashboard</h1>

        <div className="dashboardBreadcrumb">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Dashboard</span>
        </div>
      </div>

      <section className="dashboardPanel">
        <div className="dashboardTopActions">
          <Link to="/admin/product" className="dashboardMiniBtn dashboardMiniBtn--blue">
            Xem Sản phẩm
          </Link>
          <Link to="/admin/category" className="dashboardMiniBtn dashboardMiniBtn--cyan">
            Xem Danh mục
          </Link>
          <Link to="/admin/brand" className="dashboardMiniBtn dashboardMiniBtn--green">
            Xem Thương hiệu
          </Link>
        </div>

        <div className="dashboardStats dashboardStats--3">
          <div className="dashboardCard dashboardCard--blue">
            <div>
              <div className="dashboardCard__value">51</div>
              <div className="dashboardCard__label">Sản phẩm</div>
            </div>
            <FaBoxOpen className="dashboardCard__icon" />
          </div>

          <div className="dashboardCard dashboardCard--cyan">
            <div>
              <div className="dashboardCard__value">6</div>
              <div className="dashboardCard__label">Danh mục</div>
            </div>
            <FaListUl className="dashboardCard__icon" />
          </div>

          <div className="dashboardCard dashboardCard--green">
            <div>
              <div className="dashboardCard__value">4</div>
              <div className="dashboardCard__label">Thương hiệu</div>
            </div>
            <FaTags className="dashboardCard__icon" />
          </div>
        </div>
      </section>

      <div className="dashboardStats dashboardStats--2">
        <div className="dashboardCard dashboardCard--yellow">
          <div>
            <div className="dashboardCard__value">0 VNĐ</div>
            <div className="dashboardCard__label">Doanh thu tháng</div>
          </div>
          <FaMoneyBillWave className="dashboardCard__icon" />
        </div>

        <div className="dashboardCard dashboardCard--red">
          <div>
            <div className="dashboardCard__value">0 VNĐ</div>
            <div className="dashboardCard__label">Doanh thu năm</div>
          </div>
          <FaChartLine className="dashboardCard__icon" />
        </div>
      </div>

      <section className="dashboardPanel">
        <div className="dashboardPanel__title">Món ăn có nhiều đánh giá nhất</div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Hình</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng đánh giá</th>
              </tr>
            </thead>

            <tbody>
              {topFoods.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="image-cell">
                    <img className="table-image" src={item.image} alt={item.name} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.reviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}