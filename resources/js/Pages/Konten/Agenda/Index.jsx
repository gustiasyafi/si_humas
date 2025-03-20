import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button, Space, Input, Tag, Dropdown } from "antd";
import {
    PopiconsEditLine,
    PopiconsEyeLine,
    PopiconsPlusLine,
} from "@popicons/react";
import { PopiconsEllipsisVerticalSolid } from "@popicons/react";

export default function Agenda() {
    const { Search } = Input;
    const onSearch = (value, _e, info) => console.log(info?.source, value);

    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Agenda" },
    ];

    const handleView = (userId) => {
        router.visit(`/agenda/detail/${userId}`);
    };
    const handleEdit = (userId) => {
        router.visit(`/agenda/edit/${userId}`);
    };

    const dataSource = [
        {
            key: 1,
            name: "BNPT National Student Journalism Competition 2025",
            date: "15 Mar 2025",
            time: "08:00 WIB",
            location: "Gedung Penunjang Operasional (GPO) TVRI, Jakarta",
            category: "Mahasiswa UNS",
            organizer: "BNPT",
            pic: "Budi Santoso",
            status: "Diajukan",
            notes: "Belum ada catatan",
        },
        {
            key: 2,
            name: "Startup Collaboration Day",
            date: "10 Mar 2025",
            time: "10:00 WIB",
            location: "The Sunan Hotel Solo, Surakarta",
            category: "Kerja Sama UNS",
            organizer: "Gojek / Tokopedia (GoTo)",
            pic: "Andi Pratama",
            status: "Diproses",
            notes: "Belum ada catatan",
        },
        {
            key: 3,
            name: "Kampus Mengajar Bersama UNS & Mitra",
            date: "28 Feb 2025",
            time: "09:00 WIB",
            location: "Auditorium Universitas Sebelas Maret",
            category: "Kerja Sama UNS",
            organizer: "Universitas Sebelas Maret (UNS)",
            pic: "Dewi Anggraini",
            status: "Dipublikasikan",
            notes: "Belum ada catatan",
        },
    ];
    const columns = [
        { title: "Nama Agenda", dataIndex: "name", key: "name" },
        { title: "Tanggal", dataIndex: "date", key: "date" },
        { title: "Waktu", dataIndex: "time", key: "time" },
        { title: "Lokasi", dataIndex: "location", key: "location" },
        { title: "Kategori", dataIndex: "category", key: "category" },
        { title: "Penyelenggara", dataIndex: "organizer", key: "organizer" },
        { title: "Penanggung Jawab", dataIndex: "pic", key: "pic" },
        { title: "Status Agenda", dataIndex: "status", key: "status" },
        { title: "Catatan", dataIndex: "notes", key: "notes" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "Dipublikasikan"
                            ? "green"
                            : status === "Diajukan"
                              ? "orange"
                              : status === "Dibatalkan"
                                ? "gray"
                                : status === "Diproses"
                                  ? "blue"
                                  : status === "Ditolak"
                                    ? "red"
                                    : status === "Diverifikasi oleh Humas UNS"
                                      ? "purple"
                                      : "default"
                    }
                >
                    {status}
                </Tag>
            ),
            // filters: [
            //     { text: "Aktif", value: "Aktif" },
            //     { text: "Tidak Aktif", value: "Tidak Aktif" },
            // ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Aksi",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "1",
                                icon: <PopiconsEyeLine />,
                                label: "Detail Agenda",
                                onClick: () => handleView(record.key),
                            },
                            {
                                key: "2",
                                icon: <PopiconsEditLine />,
                                label: "Ubah Status",
                                onClick: () => handleEdit(record.key),
                            },
                        ],
                    }}
                    placement="bottomRight"
                    trigger={["click"]}
                >
                    <Button
                        type="text"
                        icon={<PopiconsEllipsisVerticalSolid />}
                    />
                </Dropdown>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Head title="Agenda" />

            <div>
                <div className="">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 mb-4 pt-4">
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>
                        <h1 className="px-6  text-gray-900 font-semibold text-2xl mt-4">
                            Manajemen Agenda
                        </h1>
                        <div className="px-6 mb-4 mt-4">
                            <Space size="middle">
                                <Button type="primary">Semua</Button>
                                <Button type="primary">Diajukan</Button>
                            </Space>
                        </div>
                        <div className="px-6 mb-4 mt-4 flex justify-between items-center">
                            <div className="flex-1 mr-4">
                                <Search
                                    placeholder="Search"
                                    allowClear
                                    style={{ width: 250 }}
                                    size="large"
                                    onSearch={onSearch}
                                />
                            </div>
                            <div>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PopiconsPlusLine />}
                                    onClick={() =>
                                        router.visit("/agenda/tambah")
                                    }
                                >
                                    Tambah Data
                                </Button>
                            </div>
                        </div>
                        <div className="px-6 mb-4">
                            <DataTable data={dataSource} columns={columns} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
