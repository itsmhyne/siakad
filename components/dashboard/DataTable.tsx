"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "sonner"; // [BARU] Import Toast dari Sonner

// Import Komponen Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentService } from "@/services/studentServices";

// Import Service API

// Tipe Data
type Student = {
  id: number;
  nis: string; nisn: string | null; nik: string | null; card_uid: string | null;
  name: string; gender: "L" | "P"; place_of_birth: string | null; date_of_birth: string | null; religion: string | null;
  address: string | null; phone_number: string | null; email: string | null;
  father_name: string | null; mother_name: string | null; parent_phone: string | null;
  class_id: number | null; status: "active" | "graduated" | "transferred" | "dropped"; enrollment_date: string | null;
  class_room: { id: number; name: string; } | null;
};

type ClassRoom = { id: number; name: string; };

// Komponen Input Modular (Ditaruh di LUAR agar tidak re-render/kursor hilang)
const InputField = ({ label, type = "text", field, req = false, ph = "", formData, setFormData }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-muted-foreground">
      {label} {req && <span className="text-destructive">*</span>}
    </label>
    <Input 
      type={type} 
      required={req} 
      placeholder={ph} 
      value={(formData as any)[field] || ""} 
      onChange={(e) => setFormData({...formData, [field]: e.target.value})} 
    />
  </div>
);

export default function DataTable({ 
  data, pageCount, currentPage, classes
}: { 
  data: Student[], pageCount: number, currentPage: number, classes: ClassRoom[]
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialForm = {
    id: 0, nis: "", nisn: "", nik: "", card_uid: "",
    name: "", gender: "L", place_of_birth: "", date_of_birth: "", religion: "",
    address: "", phone_number: "", email: "",
    father_name: "", mother_name: "", parent_phone: "",
    class_id: "none", status: "active", enrollment_date: ""
  };
  const [formData, setFormData] = useState(initialForm);

  // Kolom Tabel (Hanya untuk Tampilan Desktop)
  const columns: any[] = [
    {
      accessorKey: "nis", header: "NIS",
      cell: (info: any) => <span className="font-mono font-medium">{info.getValue()}</span>,
    },
    { accessorKey: "name", header: "Nama Siswa" },
    {
      id: "class_name", header: "Kelas",
      cell: (info: any) => info.row.original.class_room ? (
        <span className="font-medium">{info.row.original.class_room.name}</span>
      ) : <span className="text-muted-foreground text-xs italic">Belum diset</span>,
    },
    {
      accessorKey: "card_uid", header: "UID Kartu",
      cell: (info: any) => info.getValue() ? (
        <span className="px-2 py-0.5 rounded-md border border-green-200 bg-green-100 text-xs font-semibold text-green-800 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-400">{info.getValue()}</span>
      ) : <span className="text-muted-foreground text-xs italic">Belum Ada</span>,
    },
    {
      id: "actions", header: "Aksi",
      cell: (info: any) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => openModal("edit", info.row.original)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(info.row.original.id)}>Hapus</Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data, columns, pageCount,
    state: { pagination: { pageIndex: currentPage - 1, pageSize: 10 } },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(), 
  });

  // Filter & Paginasi URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value); else params.delete("search");
      params.set("page", "1"); router.push(`${pathname}?${params.toString()}`);
    }, 500); 
  };

  const handleClassFilterChange = (val: string | null) => {
    const safeVal = val || "all";
    const params = new URLSearchParams(searchParams.toString());
    if (safeVal && safeVal !== "all") params.set("class_id", safeVal); else params.delete("class_id");
    params.set("page", "1"); router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (newPageIndex + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // CRUD Actions
  const openModal = (mode: "add" | "edit", student?: Student) => {
    setModalMode(mode);
    if (mode === "edit" && student) {
      setFormData({
        id: student.id,
        nis: student.nis || "", nisn: student.nisn || "", nik: student.nik || "", card_uid: student.card_uid || "",
        name: student.name || "", gender: student.gender || "L", place_of_birth: student.place_of_birth || "", date_of_birth: student.date_of_birth || "", religion: student.religion || "",
        address: student.address || "", phone_number: student.phone_number || "", email: student.email || "",
        father_name: student.father_name || "", mother_name: student.mother_name || "", parent_phone: student.parent_phone || "",
        class_id: student.class_id?.toString() || "none", status: student.status || "active", enrollment_date: student.enrollment_date || ""
      });
    } else {
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Hilangkan string kosong & "none" agar tidak dikirim
    const payload = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "" && v !== "none"));

    try {
      if (modalMode === "add") {
        await StudentService.create(payload);
        toast.success("Berhasil!", { description: "Siswa baru telah ditambahkan ke sistem." });
      } else {
        await StudentService.update(formData.id, payload);
        toast.success("Berhasil!", { description: "Data siswa berhasil diperbarui." });
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal Menyimpan", { description: error.message || "Periksa kembali inputan Anda." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      await StudentService.delete(id);
      toast.success("Data Dihapus", { description: "Siswa berhasil dihapus dari sistem." });
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal Menghapus", { description: error.message || "Terjadi kesalahan koneksi." });
    }
  };

  const currentClassFilter = searchParams.get("class_id") || "all";

  return (
    <div className="w-full space-y-4">
      {/* FILTER & TOMBOL TAMBAH */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-end mb-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Cari nama atau NIS siswa..." 
            value={searchTerm} 
            onChange={(e) => handleSearchChange(e.target.value)} 
            className="w-full sm:w-75" 
          />
          <Select value={currentClassFilter} onValueChange={handleClassFilterChange}>
            <SelectTrigger className="w-full sm:w-50">
              <SelectValue placeholder="Semua Kelas">
                {currentClassFilter === "all" || !currentClassFilter
                  ? "Semua Kelas"
                  : classes.find(c => c.id.toString() === currentClassFilter)?.name || "Semua Kelas"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => openModal("add")} className="w-full sm:w-auto">
          + Tambah Siswa
        </Button>
      </div>

      {/* 1. TAMPILAN DESKTOP & TABLET (Tersembunyi di HP) */}
      <div className="hidden md:block rounded-md border overflow-x-auto bg-card">
        <Table className="min-w-175">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map((row: any) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 2. TAMPILAN KARTU UNTUK MOBILE/HP (Tersembunyi di Desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map((row: any) => {
          const student = row.original;
          return (
            <div key={row.id} className="bg-card text-card-foreground border rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold text-base leading-tight">{student.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 font-mono">{student.nis}</p>
                </div>
                {student.class_room ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground whitespace-nowrap">
                    {student.class_room.name}
                  </span>
                ) : (
                  <span className="text-xs italic text-muted-foreground whitespace-nowrap">Tanpa Kelas</span>
                )}
              </div>
              
              <div className="flex justify-between items-end pt-3 border-t">
                <div>
                  {student.card_uid ? (
                    <span className="inline-flex items-center rounded-md border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-400">
                      UID: {student.card_uid}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Belum ada RFID</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openModal("edit", student)} className="h-8 text-xs">Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)} className="h-8 text-xs">Hapus</Button>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-10 border rounded-xl text-muted-foreground bg-muted/20">
            Data tidak ditemukan.
          </div>
        )}
      </div>

      {/* PAGINASI */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Halaman <span className="font-medium text-foreground">{currentPage}</span> dari {pageCount}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 2)} disabled={currentPage <= 1}>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage)} disabled={currentPage >= pageCount}>
            Selanjutnya
          </Button>
        </div>
      </div>

      {/* SHADCN DIALOG (MODAL CRUD) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalMode === "add" ? "Tambah Data Siswa" : "Edit Data Siswa"}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi akademik dan biodata siswa di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <form id="studentForm" onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Section Identitas & Akademik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg border">
              <InputField label="NIS" field="nis" req={true} ph="Nomor Induk Siswa" formData={formData} setFormData={setFormData} />
              <InputField label="Nama Lengkap" field="name" req={true} formData={formData} setFormData={setFormData} />
              <InputField label="NISN" field="nisn" formData={formData} setFormData={setFormData} />
              <InputField label="NIK" field="nik" formData={formData} setFormData={setFormData} />
              <InputField label="UID Kartu RFID" field="card_uid" ph="Scan kartu di sini..." formData={formData} setFormData={setFormData} />
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Kelas</label>
                <Select value={formData.class_id} onValueChange={(val) => setFormData({...formData, class_id: val || "none"})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Belum ada kelas --">
                      {formData.class_id === "none" || !formData.class_id
                        ? "-- Belum ada kelas --"
                        : classes.find(c => c.id.toString() === formData.class_id)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Belum ada kelas --</SelectItem>
                    {classes.map((cls) => <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status Siswa</label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: (val as any) || "active"})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Status">
                      {formData.status === "active" ? "Aktif" :
                       formData.status === "graduated" ? "Lulus" :
                       formData.status === "transferred" ? "Pindah" :
                       formData.status === "dropped" ? "Dikeluarkan" : "Aktif"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="graduated">Lulus</SelectItem>
                    <SelectItem value="transferred">Pindah</SelectItem>
                    <SelectItem value="dropped">Dikeluarkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <InputField label="Tanggal Masuk" field="enrollment_date" type="date" formData={formData} setFormData={setFormData} />
            </div>

            {/* Section Biodata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Jenis Kelamin *</label>
                <Select value={formData.gender} onValueChange={(val) => setFormData({...formData, gender: (val as any) || "L"})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Kelamin">
                      {formData.gender === "P" ? "Perempuan (P)" : "Laki-laki (L)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki (L)</SelectItem>
                    <SelectItem value="P">Perempuan (P)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <InputField label="Agama" field="religion" formData={formData} setFormData={setFormData} />
              <InputField label="Tempat Lahir" field="place_of_birth" formData={formData} setFormData={setFormData} />
              <InputField label="Tanggal Lahir" field="date_of_birth" type="date" formData={formData} setFormData={setFormData} />
            </div>

            {/* Section Kontak & Ortu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email Siswa" field="email" type="email" formData={formData} setFormData={setFormData} />
              <InputField label="No. Handphone" field="phone_number" formData={formData} setFormData={setFormData} />
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Alamat Lengkap</label>
                <Textarea 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  rows={2} 
                  className="resize-none"
                />
              </div>

              <InputField label="Nama Ayah" field="father_name" formData={formData} setFormData={setFormData} />
              <InputField label="Nama Ibu" field="mother_name" formData={formData} setFormData={setFormData} />
              <div className="md:col-span-2">
                <InputField label="No. WA Orang Tua (Untuk Notif Absen)" field="parent_phone" formData={formData} setFormData={setFormData} />
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" form="studentForm" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}