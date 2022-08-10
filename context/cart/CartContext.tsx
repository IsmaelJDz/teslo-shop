import { createContext } from "react";
import { ICartProduct } from "../../interfaces";

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeProductFromCart: (id: ICartProduct) => void;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

export const CartContext = createContext({} as ContextProps);
