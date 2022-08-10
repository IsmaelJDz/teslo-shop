import { FC, useEffect, useReducer } from "react";
import Cookie from "js-cookie";
import { CartContext, CartReducer } from "./";
import { ICartProduct } from "../../interfaces";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

interface UIProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: Cookie.get("cart")?.length === 0 ? false : true,
  cart: Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
};

export const CartProvider: FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, CART_INITIAL_STATE);

  // useEffect(() => {
  //   const cookieProducts = Cookie.get("cart")
  //     ? JSON.parse(Cookie.get("cart")!)
  //     : [];

  //   dispatch({
  //     type: "[Cart] - LoadCart from cookies | storage",
  //     payload: cookieProducts,
  //   });
  // }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    const subTotal = state.cart.reduce(
      (acc, curr) => acc + curr.quantity * curr.price,
      0
    );
    const tax = subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax,
      total: subTotal + tax,
    };

    dispatch({
      type: "[Cart] - Update order summary",
      payload: orderSummary,
    });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );

    if (!productInCartButDifferentSize) {
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    }

    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      p.quantity += product.quantity;
      return p;
    });

    return dispatch({
      type: "[Cart] - Update products in cart",
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: "[Cart] - Change cart quantity",
      payload: product,
    });
  };

  const removeProductFromCart = (product: ICartProduct) => {
    dispatch({
      type: "[Cart] - Remove product from cart",
      payload: product,
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
