import DataTable from "@/components/dashboard/DataTable";
import { ClassRoomService } from "@/services/classRoom";
import { StudentService } from "@/services/studentServices";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>; 
}) {
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams.page) || 1;
  const currentSearch = resolvedParams.search || '';
  const currentSortBy = resolvedParams.sort_by || 'name';
  const currentSortDir = resolvedParams.sort_dir || 'asc';
  
  // Tangkap class_id dari URL
  const currentClassId = resolvedParams.class_id || '';
  
  // [YANG DIUBAH] Gunakan Service pattern di sini
  const [studentResponse, classesResponse] = await Promise.all([
    StudentService.getAll(
      currentPage, 
      currentSearch, 
      currentClassId, // Pastikan urutannya benar: classId dulu
      currentSortBy,  // Baru Sort By
      currentSortDir
    ),
    ClassRoomService.getAll()
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