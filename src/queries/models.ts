import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { useAuthContext } from "../contexts/AuthContext";

export const useImportantModelsQuery = () => {
  const { getToken, isSignedIn, isLoading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: ["models", "important"],
    queryFn: async () => {
      const token = await getToken();
      return api.getImportantModels(token);
    },
    enabled: !authLoading && isSignedIn,
  });
};

export const useAllModelsQuery = () => {
  const { getToken, isSignedIn, isLoading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: ["models", "all"],
    queryFn: async () => {
      const token = await getToken();
      return api.getAllModels(token);
    },
    enabled: !authLoading && isSignedIn,
  });
};
