import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { getCartProducts } from "@/db/queries/cart";
import {
  buildCartSnapshot,
  decodeCartCookie,
  encodeCartCookie,
  type CartEntry,
} from "@/lib/cart-model";

const CART_COOKIE_NAME = "atelier_cart";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function readCartEntries() {
  const cookieStore = await cookies();
  return decodeCartCookie(cookieStore.get(CART_COOKIE_NAME)?.value);
}

export async function resolveCart(entries: CartEntry[]) {
  const products = await getCartProducts(entries.map((entry) => entry.productId));
  return buildCartSnapshot(entries, products);
}

export const getCart = cache(async () => resolveCart(await readCartEntries()));

export async function writeCartEntries(items: CartEntry[]) {
  const cookieStore = await cookies();

  if (items.length === 0) {
    cookieStore.delete(CART_COOKIE_NAME);
    return;
  }

  cookieStore.set(CART_COOKIE_NAME, encodeCartCookie(items), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}
