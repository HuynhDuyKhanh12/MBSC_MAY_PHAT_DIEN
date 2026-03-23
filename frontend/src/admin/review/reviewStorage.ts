export type ReviewItem = {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  status: boolean;
  deleted?: boolean;
};

const STORAGE_KEY = "admin_reviews";

const defaultReviews: ReviewItem[] = [
  {
    id: 1,
    userId: 1,
    productId: 2,
    rating: 5,
    comment: "Rất tốt",
    status: true,
    deleted: false,
  },
  {
    id: 2,
    userId: 3,
    productId: 1,
    rating: 4,
    comment: "Sản phẩm ổn, giao hàng nhanh",
    status: true,
    deleted: false,
  },
];

export function getReviews(): ReviewItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
    return defaultReviews;
  }
  return JSON.parse(raw);
}

export function saveReviews(reviews: ReviewItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function getReviewById(id: number) {
  return getReviews().find((item) => item.id === id);
}

export function addReview(review: Omit<ReviewItem, "id">) {
  const reviews = getReviews();
  const nextId = reviews.length ? Math.max(...reviews.map((item) => item.id)) + 1 : 1;

  const newReview: ReviewItem = {
    ...review,
    id: nextId,
  };

  saveReviews([newReview, ...reviews]);
}

export function toggleReviewStatus(id: number) {
  const reviews = getReviews().map((item) =>
    item.id === id ? { ...item, status: !item.status } : item
  );
  saveReviews(reviews);
}

export function softDeleteReview(id: number) {
  const reviews = getReviews().map((item) =>
    item.id === id ? { ...item, deleted: true } : item
  );
  saveReviews(reviews);
}

export function restoreReview(id: number) {
  const reviews = getReviews().map((item) =>
    item.id === id ? { ...item, deleted: false } : item
  );
  saveReviews(reviews);
}

export function deleteReviewForever(id: number) {
  const reviews = getReviews().filter((item) => item.id !== id);
  saveReviews(reviews);
}

export function clearReviewTrash() {
  const reviews = getReviews().filter((item) => !item.deleted);
  saveReviews(reviews);
}