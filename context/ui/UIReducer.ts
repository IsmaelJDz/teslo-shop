import { UIState } from "./";

type UIActionType = { type: "UI - ToggleMenu" };
// | { type: "UI - Close Sidebar" }

export const UIReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case "UI - ToggleMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };

    default:
      return state;
  }
};
