import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_CART_ITEMS,
  addCartEntry,
  buildCartSnapshot,
  decodeCartCookie,
  encodeCartCookie,
  removeCartEntry,
  updateCartEntry,
  type CartEntry,
  type CartProduct,
} from "./cart-model.ts";

const productId = "11111111-1111-4111-8111-111111111111";
const secondProductId = "22222222-2222-4222-8222-222222222222";

function product(overrides: Partial<CartProduct> = {}): CartProduct {
  return {
    id: productId,
    slug: "column-bag",
    name: "Column Bag",
    subtitle: "Structured leather",
    priceInCents: 148000,
    currency: "USD",
    imageSrc: "/product-column-bag.jpg",
    imageAlt: "Column bag",
    stockQuantity: 10,
    ...overrides,
  };
}

test("empty and malformed cookies resolve to an empty cart", () => {
  assert.deepEqual(decodeCartCookie(undefined), []);
  assert.deepEqual(decodeCartCookie("not-base64-json"), []);
  assert.deepEqual(
    decodeCartCookie(Buffer.from(JSON.stringify({ v: 2, items: [] })).toString("base64url")),
    [],
  );
});

test("cookie decoding removes invalid and duplicate entries", () => {
  const encoded = Buffer.from(JSON.stringify({
    v: 1,
    i: [
      [productId, 2],
      [productId, 3],
      ["invalid", 1],
      [secondProductId, 0],
    ],
  })).toString("base64url");

  assert.deepEqual(decodeCartCookie(encoded), [{ productId, quantity: 2 }]);
  assert.deepEqual(decodeCartCookie(encodeCartCookie([{ productId, quantity: 2 }])), [
    { productId, quantity: 2 },
  ]);
});

test("the maximum cart remains within the browser cookie size limit", () => {
  const items: CartEntry[] = Array.from({ length: MAX_CART_ITEMS }, (_, index) => ({
    productId: `${index.toString(16).padStart(8, "0")}-1111-4111-8111-111111111111`,
    quantity: 999,
  }));

  assert.ok(encodeCartCookie(items).length <= 4096);
});

test("adding creates and increments a line without exceeding stock", () => {
  assert.deepEqual(addCartEntry([], productId, 2), {
    ok: true,
    items: [{ productId, quantity: 1 }],
  });
  assert.deepEqual(addCartEntry([{ productId, quantity: 1 }], productId, 2), {
    ok: true,
    items: [{ productId, quantity: 2 }],
  });
  assert.equal(addCartEntry([{ productId, quantity: 2 }], productId, 2).ok, false);
});

test("adding enforces the distinct-product limit", () => {
  const items: CartEntry[] = Array.from({ length: MAX_CART_ITEMS }, (_, index) => ({
    productId: `${index.toString(16).padStart(8, "0")}-1111-4111-8111-111111111111`,
    quantity: 1,
  }));

  assert.equal(addCartEntry(items, secondProductId, 10).ok, false);
});

test("updating requires a positive whole number within current stock", () => {
  const items = [{ productId, quantity: 1 }];

  assert.deepEqual(updateCartEntry(items, productId, 3, 5), {
    ok: true,
    items: [{ productId, quantity: 3 }],
  });
  assert.equal(updateCartEntry(items, productId, 0, 5).ok, false);
  assert.equal(updateCartEntry(items, productId, -1, 5).ok, false);
  assert.equal(updateCartEntry(items, productId, 1.5, 5).ok, false);
  assert.equal(updateCartEntry(items, productId, 6, 5).ok, false);
});

test("removing deletes only the requested line", () => {
  assert.deepEqual(
    removeCartEntry(
      [
        { productId, quantity: 1 },
        { productId: secondProductId, quantity: 2 },
      ],
      productId,
    ),
    [{ productId: secondProductId, quantity: 2 }],
  );
});

test("snapshot uses current prices and calculates totals in cents", () => {
  const snapshot = buildCartSnapshot(
    [{ productId, quantity: 2 }],
    [product({ priceInCents: 150000 })],
  );

  assert.equal(snapshot.items[0]?.lineTotalInCents, 300000);
  assert.equal(snapshot.subtotalInCents, 300000);
  assert.equal(snapshot.totalQuantity, 2);
});

test("snapshot clamps reduced stock and keeps sold-out lines visible", () => {
  const reduced = buildCartSnapshot(
    [{ productId, quantity: 5 }],
    [product({ stockQuantity: 2 })],
  );
  assert.equal(reduced.items[0]?.quantity, 2);
  assert.equal(reduced.hasAdjustments, true);
  assert.deepEqual(reduced.sanitizedItems, [{ productId, quantity: 2 }]);

  const soldOut = buildCartSnapshot(
    [{ productId, quantity: 1 }],
    [product({ stockQuantity: 0 })],
  );
  assert.equal(soldOut.items.length, 1);
  assert.equal(soldOut.items[0]?.isSoldOut, true);
  assert.equal(soldOut.totalQuantity, 0);
  assert.equal(soldOut.subtotalInCents, 0);
  assert.deepEqual(soldOut.sanitizedItems, []);
});

test("snapshot omits missing or unpublished query results", () => {
  const snapshot = buildCartSnapshot([{ productId, quantity: 1 }], []);

  assert.deepEqual(snapshot.items, []);
  assert.equal(snapshot.hasAdjustments, true);
});
