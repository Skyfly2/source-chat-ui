import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { useAuthContext } from "../contexts/AuthContext";

export const useModelsQuery = () => {
  const { getToken, isSignedIn, isLoading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const token = await getToken();
      return api.getModels(token);
    },
    enabled: !authLoading && isSignedIn,
  });
};
