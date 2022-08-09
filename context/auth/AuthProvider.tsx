import { FC, useReducer, useEffect } from "react";
import Cookie from "js-cookie";
import { AuthContext, AuthReducer } from "./";
import { IUser } from "../../interfaces";
import { tesloApi } from "../../api";
import axios, { AxiosError } from "axios";

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

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
