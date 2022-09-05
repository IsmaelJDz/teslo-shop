import { FC, useEffect, useReducer } from "react";
import Cookie from "js-cookie";
import { CartContext, CartReducer } from "./";
import { ICartProduct, IOrder } from "../../interfaces";
import Cookies from "js-cookie";
import { tesloApi } from "../../api";
import axios from "axios";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  shippingAddress?: undefined;
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
  shippingAddress: undefined,
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
    if (Cookies.get("firstName")) {
      const shippingAddress = {
        firstName: Cookies.get("firstName") || "",
        lastName: Cookies.get("lastName") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        zip: Cookies.get("zip") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || "",
        phone: Cookies.get("phone") || "",
      };
      dispatch({
        type: "[Cart] - LoadAddress From Cookies",
        payload: shippingAddress,
      });
    }
  }, []);

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

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set("firstName", address.firstName);
    Cookies.set("lastName", address.lastName);
    Cookies.set("address", address.address);
    Cookies.set("address2", address.address2 || "");
    Cookies.set("zip", address.zip);
    Cookies.set("city", address.city);
    Cookies.set("country", address.country);
    Cookies.set("phone", address.phone);

    dispatch({
      type: "[Cart] - Update Address",
      payload: address,
    });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No shipping address");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>("/orders", body);

      dispatch({
        type: "[Cart] - Order complete",
      });

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data as { message: string };

        return {
          hasError: true,
          //message: error.response?.data as string,
          message,
        };
      }

      return {
        hasError: true,
        message: "Something went wrong",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeProductFromCart,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
