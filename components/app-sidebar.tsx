"use client"

import * as React from "react"

import { NavAkademik } from "@/components/nav-akademik"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, LifeBuoyIcon, SendIcon, FrameIcon, PieChartIcon, MapIcon, TerminalIcon, MoreHorizontalIcon, LayoutDashboardIcon, School2Icon, BookAudioIcon, UsersRound, BookCopyIcon, Blocks, BlocksIcon, ColumnsSettingsIcon, BookMarkedIcon, BookUpIcon, MonitorCheck, MonitorCheckIcon, BookCheckIcon, BookDashed, Check, CheckCircleIcon, PenLineIcon, LucidePlayingCardsFan } from "lucide-react"
import { NavMasterdata } from "./nav-masterdata"
import { NavAbsensi } from "./nav-absensi"
import { NavPenilaian } from "./nav-penilaian"
import Link from "next/link"

const data = {
  user: {
    name: "Developer",
    email: "developer@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navAkademik: [
    {
      title: "Manajemen Kelas (Rombel)",
      url: "#",
      icon: (
        <ColumnsSettingsIcon
        />
      ),
      isActive: true,
      items: [],
    },
    {
      title: "Jadwal Pelajaran",
      url: "#",
      icon: (
        <BookMarkedIcon
        />
      ),
      items: [],
    },
    {
      title: "Kenaikan Kelas",
      url: "#",
      icon: (
        <BookUpIcon
        />
      ),
      items: [],
    },
  ],
  navAbsensi: [
    {
      title: "Monitor Tap Realtime",
      url: "#",
      icon: (
        <MonitorCheckIcon
        />
      ),
      items: [],
    },
    {
      title: "Absensi Mata Pelajaran",
      url: "#",
      icon: (
        <BookCheckIcon
        />
      ),
      items: [],
    },
    {
      title: "Rekap Kehadiran",
      url: "#",
      icon: (
        <BookDashed/>
      ),
      items: [],
    },
  ],
  navPenilaian: [
    {
      title: "Bobot Penilaian",
      url: "#",
      icon: (
        <CheckCircleIcon
        />
      ),
      items: [],
    },
    {
      title: "Input Nilai",
      url: "#",
      icon: (
        <PenLineIcon
        />
      ),
      items: [],
    },
    {
      title: "Cetak Raport",
      url: "#",
      icon: (
        <LucidePlayingCardsFan/>
      ),
      items: [],
    },
  ],
  navMasterdata: [
    {
      title: "Profil Sekolah",
      url: "#",
      icon: (
        <School2Icon
        />
      ),
      items:[]
    },
    {
      title: "Tahun Ajaran & Semester",
      url: "#",
      icon: (
        <BookAudioIcon
        />
      ),
      items: [
        {
          title: "Ganjil 2026/2027",
          url: "#",
        },
      ],
    },
    {
      title: "Data Guru & Staff",
      url: "#",
      icon: (
        <UsersRound
        />
      ),
      items:[]
    },
    {
      title: "Data Siswa",
      url: "/dashboard/students",
      icon: (
        <UsersRound
        />
      ),
      items:[],
    },{
      title: "Data Mata Pelajaran",
      url: "#",
      icon: (
        <BookCopyIcon
        />
      ),
      items:[]
    },{
      title: "Data Ruangan & Kelas",
      url: "#",
      icon: (
        <BlocksIcon/>
      ),
      items:[]
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">SMK Elite 45 Blitar</span>
                <span className="truncate text-xs">v.1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
          <Link href={"/dashboard"}><SidebarMenuItem>
          <SidebarMenuButton>
            <LayoutDashboardIcon
            />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem></Link>
          </SidebarMenu>
        </SidebarGroup>
        <NavMasterdata items={data.navMasterdata} />
        <NavAkademik items={data.navAkademik} />
        <NavAbsensi items={data.navAbsensi} />
        <NavPenilaian items={data.navPenilaian} />
        {/* <NavProjects projects={data.masterdata} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
