export const CART_COOKIE_VERSION = 1 as const;
export const MAX_CART_ITEMS = 50;
export const MAX_STORED_QUANTITY = 999;

export type CartEntry = {
  productId: string;
  quantity: number;
};

export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  priceInCents: number;
  currency: string;
  imageSrc: string;
  imageAlt: string;
  stockQuantity: number;
};

export type CartLine = CartProduct & {
  requestedQuantity: number;
  quantity: number;
  lineTotalInCents: number;
  isAdjusted: boolean;
  isSoldOut: boolean;
};

export type CartSnapshot = {
  items: CartLine[];
  sanitizedItems: CartEntry[];
  totalQuantity: number;
  subtotalInCents: number;
  currency: string;
  hasAdjustments: boolean;
};

export type CartMutationResult =
  | { ok: true; items: CartEntry[] }
  | { ok: false; message: string };

export type CartActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isProductId(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

function isStoredQuantity(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= MAX_STORED_QUANTITY
  );
}

export function decodeCartCookie(value: string | undefined): CartEntry[] {
  if (!value || value.length > 4096) {
    return [];
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as unknown;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("v" in parsed) ||
      parsed.v !== CART_COOKIE_VERSION ||
      !("i" in parsed) ||
      !Array.isArray(parsed.i)
    ) {
      return [];
    }

    const entries: CartEntry[] = [];
    const seen = new Set<string>();

    for (const item of parsed.i) {
      if (entries.length >= MAX_CART_ITEMS) {
        break;
      }

      if (
        !Array.isArray(item) ||
        item.length !== 2 ||
        !isProductId(item[0]) ||
        !isStoredQuantity(item[1]) ||
        seen.has(item[0])
      ) {
        continue;
      }

      seen.add(item[0]);
      entries.push({ productId: item[0], quantity: item[1] });
    }

    return entries;
  } catch {
    return [];
  }
}

export function encodeCartCookie(items: CartEntry[]) {
  return Buffer.from(
    JSON.stringify({
      v: CART_COOKIE_VERSION,
      i: items.map(({ productId, quantity }) => [productId, quantity]),
    }),
    "utf8",
  ).toString("base64url");
}

export function addCartEntry(
  items: CartEntry[],
  productId: string,
  availableStock: number,
): CartMutationResult {
  if (!isProductId(productId)) {
    return { ok: false, message: "This product could not be added." };
  }

  if (!Number.isSafeInteger(availableStock) || availableStock <= 0) {
    return { ok: false, message: "This piece is currently unavailable." };
  }

  const existing = items.find((item) => item.productId === productId);
  const nextQuantity = (existing?.quantity ?? 0) + 1;

  if (nextQuantity > availableStock) {
    return {
      ok: false,
      message: `Only ${availableStock} ${availableStock === 1 ? "piece is" : "pieces are"} available.`,
    };
  }

  if (!existing && items.length >= MAX_CART_ITEMS) {
    return {
      ok: false,
      message: `Your bag can hold up to ${MAX_CART_ITEMS} different pieces.`,
    };
  }

  return {
    ok: true,
    items: existing
      ? items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: nextQuantity }
            : item,
        )
      : [...items, { productId, quantity: 1 }],
  };
}

export function updateCartEntry(
  items: CartEntry[],
  productId: string,
  quantity: number,
  availableStock: number,
): CartMutationResult {
  if (!isProductId(productId) || !isStoredQuantity(quantity)) {
    return { ok: false, message: "Enter a valid whole-number quantity." };
  }

  if (!Number.isSafeInteger(availableStock) || availableStock <= 0) {
    return { ok: false, message: "This piece is currently unavailable." };
  }

  if (quantity > availableStock) {
    return {
      ok: false,
      message: `Only ${availableStock} ${availableStock === 1 ? "piece is" : "pieces are"} available.`,
    };
  }

  if (!items.some((item) => item.productId === productId)) {
    return { ok: false, message: "This piece is no longer in your bag." };
  }

  return {
    ok: true,
    items: items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    ),
  };
}

export function removeCartEntry(items: CartEntry[], productId: string) {
  return items.filter((item) => item.productId !== productId);
}

export function buildCartSnapshot(
  entries: CartEntry[],
  products: CartProduct[],
): CartSnapshot {
  const productsById = new Map(products.map((product) => [product.id, product]));
  let hasAdjustments = products.length !== entries.length;

  const items = entries.flatMap<CartLine>((entry) => {
    const product = productsById.get(entry.productId);

    if (!product) {
      return [];
    }

    const quantity = Math.min(entry.quantity, Math.max(product.stockQuantity, 0));
    const isAdjusted = quantity !== entry.quantity;
    hasAdjustments ||= isAdjusted;

    return [{
      ...product,
      requestedQuantity: entry.quantity,
      quantity,
      lineTotalInCents: product.priceInCents * quantity,
      isAdjusted,
      isSoldOut: product.stockQuantity <= 0,
    }];
  });

  const purchasableItems = items.filter((item) => item.quantity > 0);

  return {
    items,
    sanitizedItems: purchasableItems.map(({ id, quantity }) => ({
      productId: id,
      quantity,
    })),
    totalQuantity: purchasableItems.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    subtotalInCents: purchasableItems.reduce(
      (total, item) => total + item.lineTotalInCents,
      0,
    ),
    currency: items[0]?.currency ?? "USD",
    hasAdjustments,
  };
}
