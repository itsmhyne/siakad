import DataTable from "@/components/dashboard/DataTable";

// Fungsi Fetch Server-Side
// Fetch Siswa (Ditambah parameter classId)
async function getStudents(page: string, search: string, sortBy: string, sortDir: string, classId: string) {
  try {
    const url = `http://127.0.0.1:8000/api/students?page=${page}&search=${search}&sort_by=${sortBy}&sort_dir=${sortDir}&class_id=${classId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal');
    return await res.json();
  } catch (error) {
    return null;
  }
}

// Fetch Daftar Kelas untuk Dropdown
async function getClasses() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/classes', { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>; 
}) {
  const resolvedParams = await searchParams;

  const currentPage = resolvedParams.page || '1';
  const currentSearch = resolvedParams.search || '';
  const currentSortBy = resolvedParams.sort_by || 'name';
  const currentSortDir = resolvedParams.sort_dir || 'asc';
  
  // [BARU] Tangkap class_id dari URL
  const currentClassId = resolvedParams.class_id || '';
  
  // Tarik kedua data secara bersamaan (Parallel Fetching agar lebih cepat)
  const [studentResponse, classesResponse] = await Promise.all([
    getStudents(currentPage, currentSearch, currentSortBy, currentSortDir, currentClassId),
    getClasses()
  ]);

  return (
    <div className="w-full mx-auto p-4 md:p-6">
      
      {studentResponse && studentResponse.data ? (
        <DataTable 
          data={studentResponse.data} 
          pageCount={studentResponse.last_page} 
          currentPage={studentResponse.current_page} 
          classes={classesResponse} // [BARU] Kirim daftar kelas ke komponen Client
        />
      ) : (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Koneksi ke server API (Laravel) terputus. Pastikan server berjalan.
        </div>
      )}
    </div>
  );
}