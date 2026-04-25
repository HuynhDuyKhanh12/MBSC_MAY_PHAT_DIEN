import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaHeart } from "react-icons/fa";
import {
  getWishlistsApi,
  deleteWishlistApi,
} from "../../../api/modules/wishlistApi";
import "./WishlistListPage.css";

type WishlistItem = {
  id?: number;
  userId: number;
  productId: number;
  createdAt?: string;
  product?: {
    id: number;
    name?: string;
    productName?: string;
    slug?: string;

    thumbnail?: string;
    image?: string;
    imageUrl?: string;

    price?: number;
    basePrice?: number;
    salePrice?: number;

    status?: string;
    stock?: number;

    images?: Array<{
      url?: string;
      imageUrl?: string;
      path?: string;
      isMain?: boolean;
    }>;

    category?: {
      name?: string;
    };

    brand?: {
      name?: string;
    };
  };
};

const API_URL = "http://localhost:5000";

function getImageSrc(image?: string) {
  if (!image || !String(image).trim()) return "";

  const value = String(image).trim();

  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  if (value.startsWith("/uploads/")) return `${API_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_URL}/${value}`;
  if (value.startsWith("/")) return `${API_URL}${value}`;

  return `${API_URL}/uploads/${value}`;
}

function normalizeWishlistResponse(res: any): WishlistItem[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.items)) return res.items;
  return [];
}

export default function WishlistListPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<WishlistItem | null>(null);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const res = await getWishlistsApi();
      setItems(normalizeWishlistResponse(res));
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Không tải được danh sách yêu thích"
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  const getProductName = (item: WishlistItem) => {
    return (
      item.product?.name ||
      item.product?.productName ||
      "Không có tên sản phẩm"
    );
  };

  const getProductImage = (item: WishlistItem) => {
    const product: any = item.product || {};
    const images = product.images || [];

    const mainImage = images.find((img: any) => img.isMain) || images[0];

    const rawImage =
      product.thumbnail ||
      product.image ||
      product.imageUrl ||
      mainImage?.url ||
      mainImage?.imageUrl ||
      mainImage?.path ||
      "";

    const src = getImageSrc(rawImage);

    return src || "https://placehold.co/120x120?text=No+Image";
  };

  const formatMoney = (value?: number) => {
    if (!value) return "0đ";
    return Number(value).toLocaleString("vi-VN") + "đ";
  };

  const getProductPrice = (item: WishlistItem) => {
    return item.product?.basePrice || item.product?.price || 0;
  };

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) => {
      const productName = getProductName(item).toLowerCase();
      const brandName = item.product?.brand?.name?.toLowerCase() || "";
      const categoryName = item.product?.category?.name?.toLowerCase() || "";

      return (
        productName.includes(q) ||
        brandName.includes(q) ||
        categoryName.includes(q) ||
        String(item.userId).includes(q) ||
        String(item.productId).includes(q)
      );
    });
  }, [items, keyword]);

  const handleDelete = async (item: WishlistItem) => {
    const ok = window.confirm(
      `Bạn có chắc muốn xóa "${getProductName(
        item
      )}" khỏi danh sách yêu thích?`
    );

    if (!ok) return;

    try {
      await deleteWishlistApi(item.productId);
      alert("Xóa wishlist thành công");
      fetchWishlists();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Xóa wishlist thất bại");
    }
  };

  return (
    <div className="wishlistAdminPage">
      <div className="wishlistHeader">
        <div>
          <h1>
            <FaHeart /> Danh sách yêu thích
          </h1>
          <p>Quản lý sản phẩm khách hàng đã thêm vào yêu thích</p>
        </div>

        <button className="reloadBtn" onClick={fetchWishlists}>
          Tải lại
        </button>
      </div>

      <div className="wishlistToolbar">
        <div className="wishlistSearch">
          <FaSearch />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, brand, danh mục, user id..."
          />
        </div>

        <div className="wishlistTotal">
          Tổng: <b>{filteredItems.length}</b> sản phẩm
        </div>
      </div>

      <div className="wishlistTableWrap">
        <table className="wishlistTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Brand</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>User ID</th>
              <th>Trạng thái</th>
              <th>Ngày thêm</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="emptyCell">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="emptyCell">
                  Không có sản phẩm yêu thích nào
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={`${item.userId}-${item.productId}-${index}`}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="productBox">
                      <img
                        src={getProductImage(item)}
                        alt={getProductName(item)}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/120x120?text=No+Image";
                        }}
                      />

                      <div>
                        <h4>{getProductName(item)}</h4>
                        <span>ID sản phẩm: {item.productId}</span>
                      </div>
                    </div>
                  </td>

                  <td>{item.product?.brand?.name || "—"}</td>
                  <td>{item.product?.category?.name || "—"}</td>

                  <td>
                    {item.product?.salePrice ? (
                      <div className="priceBox">
                        <b>{formatMoney(item.product.salePrice)}</b>
                        <del>{formatMoney(getProductPrice(item))}</del>
                      </div>
                    ) : (
                      <b>{formatMoney(getProductPrice(item))}</b>
                    )}
                  </td>

                  <td>{item.userId}</td>

                  <td>
                    <span
                      className={
                        item.product?.status === "ACTIVE"
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {item.product?.status || "Không rõ"}
                    </span>
                  </td>

                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>

                  <td>
                    <div className="actionGroup">
                      <button
                        type="button"
                        className="viewBtn"
                        onClick={() => setSelected(item)}
                      >
                        Xem
                      </button>

                      <button
                        type="button"
                        className="deleteBtn"
                        onClick={() => handleDelete(item)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="wishlistModalOverlay" onClick={() => setSelected(null)}>
          <div className="wishlistModal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="closeModal"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <img
              src={getProductImage(selected)}
              alt={getProductName(selected)}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/400x300?text=No+Image";
              }}
            />

            <h2>{getProductName(selected)}</h2>

            <p>
              <b>User ID:</b> {selected.userId}
            </p>
            <p>
              <b>Product ID:</b> {selected.productId}
            </p>
            <p>
              <b>Brand:</b> {selected.product?.brand?.name || "—"}
            </p>
            <p>
              <b>Danh mục:</b> {selected.product?.category?.name || "—"}
            </p>
            <p>
              <b>Giá:</b> {formatMoney(getProductPrice(selected))}
            </p>
            <p>
              <b>Giá khuyến mãi:</b>{" "}
              {selected.product?.salePrice
                ? formatMoney(selected.product.salePrice)
                : "—"}
            </p>
            <p>
              <b>Trạng thái:</b> {selected.product?.status || "Không rõ"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}