import { FC, useReducer } from "react";
import { UIContext, UIReducer } from "./";

export interface UIState {
  isMenuOpen: boolean;
}

interface UIProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,
};

export const UIProvider: FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    console.log("toggleSideMenu");
    dispatch({ type: "UI - ToggleMenu" });
  };
  return (
    <UIContext.Provider
      value={{
        ...state,
        toggleSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
