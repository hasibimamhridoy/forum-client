import { useSession } from "next-auth/react";

const useAuth = () => {
  const { data } = useSession();
  const user = (data as any)?.token;
  return {
    accessToken: user?.accessToken,
    userName: user?.userName,
    email: user?.email,
    userId: user?.userId,
    role: user?.role,
  };
};

export default useAuth;
