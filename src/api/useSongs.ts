import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:3001";

const fetcher = async (endpoint: string) => {
  const res = await fetch(`${API_URL}/${endpoint}`);
  if (!res.ok) throw new Error("Failed to fetch " + endpoint);
  return res.json();
};

export const useSongs = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: () => fetcher("songs"),
  });
};
