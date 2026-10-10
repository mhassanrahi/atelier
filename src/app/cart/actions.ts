"use server";

import { getCartProduct } from "@/db/queries/cart";
import {
  addCartEntry,
  isProductId,
  removeCartEntry,
  updateCartEntry,
  type CartActionState,
} from "@/lib/cart-model";
import {
  readCartEntries,
  resolveCart,
  writeCartEntries,
} from "@/lib/cart";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function getSanitizedCart() {
  return resolveCart(await readCartEntries());
}

export async function addCartItem(
  _previousState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const productId = readString(formData, "productId");

  if (!isProductId(productId)) {
    return { status: "error", message: "This product could not be added." };
  }

  const [cart, product] = await Promise.all([
    getSanitizedCart(),
    getCartProduct(productId),
  ]);

  if (!product) {
    return { status: "error", message: "This piece is no longer available." };
  }

  const result = addCartEntry(
    cart.sanitizedItems,
    productId,
    product.stockQuantity,
  );

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  await writeCartEntries(result.items);
  return { status: "success", message: "Added to your bag." };
}

export async function updateCartItem(
  _previousState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const productId = readString(formData, "productId");
  const rawQuantity = readString(formData, "quantity");
  const quantity = Number(rawQuantity);

  if (!isProductId(productId)) {
    return { status: "error", message: "This cart item is invalid." };
  }

  const [cart, product] = await Promise.all([
    getSanitizedCart(),
    getCartProduct(productId),
  ]);

  if (!product) {
    return { status: "error", message: "This piece is no longer available." };
  }

  const result = updateCartEntry(
    cart.sanitizedItems,
    productId,
    quantity,
    product.stockQuantity,
  );

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  await writeCartEntries(result.items);
  return { status: "success", message: "Quantity updated." };
}

export async function removeCartItem(
  _previousState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const productId = readString(formData, "productId");

  if (!isProductId(productId)) {
    return { status: "error", message: "This cart item is invalid." };
  }

  const cart = await getSanitizedCart();
  await writeCartEntries(removeCartEntry(cart.sanitizedItems, productId));
  return { status: "success", message: "Removed from your bag." };
}
