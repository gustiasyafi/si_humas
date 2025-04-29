import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button, Input, Dropdown, Tag, message, Modal } from "antd";
import {
    PopiconsBadgeCheckLine,
    PopiconsEditLine,
    PopiconsEllipsisVerticalSolid,
    PopiconsEyeLine,
    PopiconsPlusLine,
    PopiconsBinLine,
    PopiconsFileDownloadLine,
} from "@popicons/react";
import UbahStatusBeritaModal from "@/Components/UbahStatusBeritaModal";
import { useState } from "react";
import ExportBeritaModal from "@/Components/ExportBeritaModal";

export default function Index({ berita_list }) {
    const { Search } = Input;
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const onSearch = (value) => {
        setCurrentPage(1);
        setSearchTerm(value.toLowerCase());
    };

    const [statusOpen, setStatusOpen] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };
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

    const showDeleteConfirm = (berita) => {
        setSelectedBerita(berita);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route("berita.destroy", selectedBerita.id), {
            onSuccess: () => {
                message.success("Berita berhasil dihapus");
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                message.error("Gagal menghapus berita");
            },
        });
    };

    const columns = [
        {
            title: "No",
            key: "index",
            render: (text, record, index) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        { title: "Judul Berita", dataIndex: "title", key: "title" },
        { title: "Kategori", dataIndex: "category", key: "category" },
        { title: "Prioritas", dataIndex: "priority", key: "priority" },
        { title: "Catatan", dataIndex: "notes", key: "notes" },
        {
            title: "Unit Kerja",
            key: "unit_kerja",
            render: (text, record) => record.user?.unit_kerja ?? "-",
        },
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
                                key: "detail",
                                icon: <PopiconsEyeLine />,
                                label: "Detail Berita",
                                onClick: () => handleView(record.id),
                            },
                            {
                                key: "edit",
                                icon: <PopiconsEditLine />,
                                label: "Edit Data",
                                onClick: () => handleEdit(record.id),
                            },
                            {
                                key: "status",
                                icon: <PopiconsBadgeCheckLine />,
                                label: "Ubah Status",
                                onClick: () => {
                                    setSelectedBerita(record);
                                    setStatusOpen(true);
                                },
                            },
                            {
                                key: "delete",
                                icon: <PopiconsBinLine />,
                                label: "Hapus Berita",
                                danger: true,
                                onClick: () => showDeleteConfirm(record),
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
            <Head title="Berita" />

            <div>
                <div className="">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 mb-4 pt-4">
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>
                        <h1 className="px-6  text-gray-900 font-semibold text-2xl mt-4">
                            Manajemen Berita
                        </h1>
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
                            <div className="px-4 mb-4 mt-4">
                                <Button
                                    size="large"
                                    icon={<PopiconsFileDownloadLine />}
                                    onClick={() => setShowExportModal(true)}
                                >
                                    Ekspor
                                </Button>
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
                            <DataTable
                                dataSource={berita_list.filter((item) =>
                                    item.title
                                        .toLowerCase()
                                        .includes(searchTerm),
                                )}
                                columns={columns}
                                pagination={{
                                    pageSize: pageSize,
                                    current: currentPage,
                                }}
                                onChange={handleTableChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {statusOpen && (
                <UbahStatusBeritaModal
                    data={selectedBerita}
                    visible={statusOpen}
                    menu={"berita"}
                    onClose={() => setStatusOpen(false)}
                />
            )}
            <Modal
                title="Konfirmasi Hapus Berita"
                open={isDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Hapus"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Apakah Anda yakin ingin menghapus berita{" "}
                    <strong>{selectedBerita?.name}</strong>?
                </p>
                <p className="text-gray-500 mt-2">
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </Modal>
            {showExportModal && (
                <ExportBeritaModal
                    visible={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    menu={"berita"}
                    data={{}}
                />
            )}
        </DashboardLayout>
    );
}
