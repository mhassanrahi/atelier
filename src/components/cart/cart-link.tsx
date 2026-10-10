import Link from "next/link";

import { BagIcon } from "@/components/home/icons";
import { getCart } from "@/lib/cart";

type CartLinkProps = {
  current?: boolean;
};

export async function CartLink({ current = false }: CartLinkProps) {
  const cart = await getCart();
  const itemLabel = cart.totalQuantity === 1 ? "item" : "items";

  return (
    <Link
      href="/cart"
      aria-current={current ? "page" : undefined}
      aria-label={`Shopping bag, ${cart.totalQuantity} ${itemLabel}`}
      className="link-nav inline-flex shrink-0 items-center gap-2"
    >
      <BagIcon />
      <span>{cart.totalQuantity}</span>
    </Link>
  );
}
