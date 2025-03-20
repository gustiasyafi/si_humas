import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button, Space, Input, Dropdown, Tag } from "antd";
import {
    PopiconsEditLine,
    PopiconsEllipsisVerticalSolid,
    PopiconsEyeLine,
    PopiconsPlusLine,
} from "@popicons/react";

export default function Agenda() {
    const { Search } = Input;
    const onSearch = (value, _e, info) => console.log(info?.source, value);

    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Berita" },
    ];
    const handleView = (userId) => {
        router.visit(`/berita/detail/${userId}`);
    };
    const handleEdit = (userId) => {
        router.visit(`/berita/edit/${userId}`);
    };

    const dataSource = [
        {
            key: 1,
            judul: "BNPT National Student Journalism Competition 2025",
            category: "Mahasiswa UNS",
            organizer: "BNPT",
            pic: "Budi Santoso",
            status: "Diajukan",
            notes: "Belum ada catatan",
        },
        {
            key: 2,
            judul: "Startup Collaboration Day",
            category: "Kerja Sama UNS",
            organizer: "Gojek / Tokopedia (GoTo)",
            pic: "Andi Pratama",
            status: "Diproses",
            notes: "Belum ada catatan",
        },
        {
            key: 3,
            judul: "Kampus Mengajar Bersama UNS & Mitra",
            category: "Kerja Sama UNS",
            organizer: "Universitas Sebelas Maret (UNS)",
            pic: "Dewi Anggraini",
            status: "Dipublikasikan",
            notes: "Belum ada catatan",
        },
    ];
    const columns = [
        { title: "Judul Berita", dataIndex: "judul", key: "judul" },
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
                                label: "Detail Berita",
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
                            Manajemen Berita
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
                                        router.visit("/berita/tambah")
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
