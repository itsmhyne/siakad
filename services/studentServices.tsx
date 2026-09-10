import { fetchApi } from "@/utils/api";

export const StudentService = {
  // Ambil data dengan filter
  getAll: async (page = 1, search = "", classId = "", sortBy = "name", sortDir = "asc") => {
    const params = new URLSearchParams({
      page: page.toString(),
      search,
      class_id: classId,
      sort_by: sortBy,
      sort_dir: sortDir,
    });
    return fetchApi(`/students?${params.toString()}`, { cache: "no-store" });
  },

  // Simpan data
  create: async (data: any) => {
    return fetchApi("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update data
  update: async (id: number, data: any) => {
    return fetchApi(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Hapus data
  delete: async (id: number) => {
    return fetchApi(`/students/${id}`, {
      method: "DELETE",
    });
  },
};