import { fetchApi } from "@/utils/api";

export const ClassRoomService = {
  // Ambil semua daftar kelas untuk dropdown
  getAll: async () => {
    return fetchApi("/classes", { cache: "no-store" });
  },
};