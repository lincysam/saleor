// hooks/useUser.ts
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useUser = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return {
    user,
    authenticated: !!user,
  };
};