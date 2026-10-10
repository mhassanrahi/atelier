"use client";

import { useActionState } from "react";

import { addCartItem } from "@/app/cart/actions";
import type { CartActionState } from "@/lib/cart-model";

const initialState: CartActionState = { status: "idle", message: "" };

type AddToCartFormProps = {
  productId: string;
  isSoldOut: boolean;
};

export function AddToCartForm({ productId, isSoldOut }: AddToCartFormProps) {
  const [state, action, pending] = useActionState(addCartItem, initialState);

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="button button-primary button-fluid-mobile w-full"
        disabled={isSoldOut || pending}
      >
        {isSoldOut ? "Currently unavailable" : pending ? "Adding…" : "Add to bag"}
      </button>
      <p
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${state.status === "error" ? "text-ink" : "text-ink-muted"}`}
      >
        {state.message}
      </p>
    </form>
  );
}
