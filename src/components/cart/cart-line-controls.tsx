"use client";

import { useActionState } from "react";

import { removeCartItem, updateCartItem } from "@/app/cart/actions";
import type { CartActionState } from "@/lib/cart-model";

const initialState: CartActionState = { status: "idle", message: "" };

type CartLineControlsProps = {
  productId: string;
  quantity: number;
  stockQuantity: number;
  isSoldOut: boolean;
};

export function CartLineControls({
  productId,
  quantity,
  stockQuantity,
  isSoldOut,
}: CartLineControlsProps) {
  const [updateState, updateAction, updatePending] = useActionState(
    updateCartItem,
    initialState,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeCartItem,
    initialState,
  );
  const message = removeState.message || updateState.message;
  const hasError =
    removeState.status === "error" || updateState.status === "error";

  return (
    <div className="mt-5">
      {!isSoldOut ? (
        <form action={updateAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="productId" value={productId} />
          <label className="grid gap-2">
            <span className="type-label text-ink-muted">Quantity</span>
            <input
              className="h-11 w-20 border border-line bg-canvas px-3"
              type="number"
              name="quantity"
              min="1"
              max={stockQuantity}
              step="1"
              defaultValue={quantity}
              inputMode="numeric"
              required
            />
          </label>
          <button
            type="submit"
            className="button button-secondary min-h-11 px-4 py-2"
            disabled={updatePending || removePending}
          >
            {updatePending ? "Updating…" : "Update"}
          </button>
        </form>
      ) : null}

      <form action={removeAction} className={isSoldOut ? "" : "mt-3"}>
        <input type="hidden" name="productId" value={productId} />
        <button
          type="submit"
          className="text-sm underline underline-offset-4 hover:text-ink-muted"
          disabled={updatePending || removePending}
        >
          {removePending ? "Removing…" : "Remove"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${hasError ? "text-ink" : "text-ink-muted"}`}
      >
        {message}
      </p>
    </div>
  );
}
