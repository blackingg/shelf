import { combineReducers, configureStore, AnyAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "./authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const appReducer = combineReducers({
  auth: authReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === logout.type) {
    // Reset all state to undefined to clear cache and data
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
