import { FC, useReducer, useEffect } from "react";
import Cookie from "js-cookie";
import { AuthContext, AuthReducer } from "./";
import { IUser } from "../../interfaces";
import { tesloApi } from "../../api";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

interface AuthProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[Auth] - Login", payload: data?.user as IUser });
    }
  }, [status, data]);

  // useEffect(() => {
  //   checkToken();
  // }, []);

  const checkToken = async () => {
    if (!Cookie.get("token")) {
      return;
    }

    try {
      const { data } = await tesloApi.get("/user/validate-token");
      const { token, user } = data;

      Cookie.set("token", token);

      dispatch({
        type: "[Auth] - Login",
        payload: user,
      });
    } catch (error) {
      console.log(error);
      Cookie.remove("token");
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", {
        email,
        password,
      });

      const { token, user } = data;
      Cookie.set("token", token);

      dispatch({
        type: "[Auth] - Login",
        payload: user,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{
    hasError: boolean;
    message?: string;
  }> => {
    try {
      const { data } = await tesloApi.post("/user/register", {
        name,
        email,
        password,
      });

      const { token, user } = data;
      Cookie.set("token", token);

      dispatch({
        type: "[Auth] - Login",
        payload: user,
      });

      return {
        hasError: false,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        //test mssage
        // const error = err as AxiosError;
        // return {
        //   hasError: true,
        //   message: error.message,
        // };

        // return {
        //   hasError: true,
        //   message: err.response?.data as { message: string },
        // };

        return {
          hasError: true,
          message: err.response?.data as string,
        };
      }

      return {
        hasError: true,
        message: "Something went wrong, try again",
      };
    }
  };

  const logoutUser = () => {
    //Cookie.remove("token");
    Cookie.remove("cart");
    Cookie.remove("firstName");
    Cookie.remove("lastName");
    Cookie.remove("address");
    Cookie.remove("address2");
    Cookie.remove("zip");
    Cookie.remove("city");
    Cookie.remove("country");
    Cookie.remove("phone");

    //router.reload();
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
