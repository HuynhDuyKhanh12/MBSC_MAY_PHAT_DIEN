import { prisma } from "../../config/prisma";

const getPrice = (item: any) => {
  return Number(
    item?.variant?.salePrice ??
      item?.variant?.price ??
      item?.product?.salePrice ??
      item?.product?.basePrice ??
      0
  );
};

const buildCart = (cart: any) => {
  const items = (cart.items || []).map((item: any) => {
    const price = getPrice(item);
    const quantity = Number(item.quantity);

    return {
      ...item,
      unitPrice: price,
      lineTotal: price * quantity,
    };
  });

  return {
    ...cart,
    items,
    totalQuantity: items.reduce((s: any, i: any) => s + i.quantity, 0),
    subtotal: items.reduce((s: any, i: any) => s + i.lineTotal, 0),
  };
};

const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  return cart;
};

export const getCartService = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true, variant: true },
      },
    },
  });

  return buildCart(cart);
};

export const addToCartService = async (
  userId: number,
  productId: number,
  variantId: number | null,
  quantity: number
) => {
  const cart = await getOrCreateCart(userId);

  const existed = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  if (existed) {
    await prisma.cartItem.update({
      where: { id: existed.id },
      data: { quantity: existed.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
    });
  }

  return getCartService(userId);
};

export const updateCartItemByProductService = async (
  userId: number,
  productId: number,
  variantId: number | null,
  quantity: number
) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });

  const item = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  if (!item) throw new Error("Cart item not found");

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });

  return getCartService(userId);
};

export const deleteCartItemByProductService = async (
  userId: number,
  productId: number,
  variantId: number | null
) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });

  const item = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  if (!item) throw new Error("Cart item not found");

  await prisma.cartItem.delete({
    where: { id: item.id },
  });

  return getCartService(userId);
};