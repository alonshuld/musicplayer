import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:3001";

export interface Song {
  id: number,
  name: string,
  artist: string,
  cover: string,
  sound: string,
}

const fetcher = async (endpoint: string) => {
  const res = await fetch(`${API_URL}/${endpoint}`);
  if (!res.ok) throw new Error("Failed to fetch " + endpoint);
  return res.json();
};

// Correct TypeScript version
export const useSongs = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: () => fetcher("songs"),
  });
};
