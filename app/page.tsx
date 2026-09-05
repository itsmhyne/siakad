import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-bold">Sistem Informasi Akademik SMK ELITE 45 BLITAR</h1>
          <p>Web aplikasi untuk internal SMK ELITE 45 BLITAR.</p>
          <p>Dibuat bertujuan untuk memudahkan operasional di sekolah, baik untuk guru dan siswa</p>
          <Link href={"/dashboard"}><Button className="mt-2">Pergi Ke Dashboard</Button></Link>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
