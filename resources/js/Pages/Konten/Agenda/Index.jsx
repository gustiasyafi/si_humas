import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button, Input, Tag, Dropdown, message, Modal } from "antd";
import {
    PopiconsEditLine,
    PopiconsEyeLine,
    PopiconsPlusLine,
    PopiconsEllipsisVerticalSolid,
    PopiconsBadgeCheckLine,
    PopiconsBinLine,
    PopiconsFileDownloadLine,
} from "@popicons/react";
import { useEffect, useState } from "react";
import UbahStatusAgendaModal from "@/Components/UbahStatusAgendaModal";
import ExportAgendaModal from "@/Components/ExportAgendaModal";

export default function Agenda({ agenda_list, success_message, error_message }) {
    useEffect(() => {
        if (success_message) {
            message.success(success_message);
        }
        if (error_message) {
            message.error(error_message);
        }
    }, [success_message, error_message]);
    const { Search } = Input;

    const [searchTerm, setSearchTerm] = useState("");
    const onSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };
    const [statusOpen, setStatusOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Agenda" },
    ];
    const [showExportModal, setShowExportModal] = useState(false);

    const handleView = (agendaId) => {
        if (!agendaId) {
            console.error("No agenda ID provided");
            return;
        }
        router.visit(route("agenda.show", agendaId));
    };

    const handleEdit = (agendaId) => {
        router.visit(`/agenda/edit/${agendaId}`);
    };

    const showDeleteConfirm = (agenda) => {
        setSelectedAgenda(agenda);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route("agenda.destroy", selectedAgenda.id), {
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
            render: (text, record, index) => index + 1, // Display serial number starting from 1
        },
        { 
            title: "Nama Agenda", 
            dataIndex: "name", 
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        { 
            title: "Tanggal", 
            dataIndex: "date", 
            key: "date",
        },
        { title: "Waktu", dataIndex: "time", key: "time" },
        { title: "Lokasi", dataIndex: "location", key: "location" },
        { title: "Kategori", dataIndex: "category", key: "category" },
        { title: "Penyelenggara", dataIndex: "organizer", key: "organizer" },
        { title: "Penanggung Jawab", dataIndex: "pic", key: "pic" },
        {
            title: "Status Agenda",
            dataIndex: "status_agenda",
            key: "status_agenda",
        },
        { 
            title: "Catatan",
            dataIndex: "notes", 
            key: "notes" },
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
                              : status === "Diproses"
                                ? "blue"
                                : status === "Ditolak"
                                  ? "red"
                                    : "default"
                    }
                >
                    {status}
                </Tag>
            ),
            filters: [
                { text: "Dipublikasikan", value: "Dipublikasikan" },
                { text: "Diajukan", value: "Diajukan" },
                { text: "Diproses", value: "Diproses" },
                { text: "Ditolak", value: "Ditolak" },
            ],
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
                                label: "Detail Agenda",
                                onClick: () => handleView(record.id),
                            },
                            {
                                key: "edit",
                                icon: <PopiconsEditLine />,
                                label: "Edit Agenda",
                                onClick: () => handleEdit(record.id),
                            },
                            {
                                key: "status",
                                icon: <PopiconsBadgeCheckLine />,
                                label: "Ubah Status",
                                onClick: () => {
                                    setSelectedAgenda(record);
                                    setStatusOpen(true);
                                },
                            },
                            {
                                key: "delete",
                                icon: <PopiconsBinLine />,
                                label: "Hapus Agenda",
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
                        <div className="px-6 mb-4 mt-4 flex justify-between items-center">
                            <div className="flex-1 mr-4">
                                <Search
                                    placeholder="Search"
                                    allowClear
                                    style={{ width: 250 }}
                                    size="large"
                                    onSearch={onSearch}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value.toLowerCase())
                                    }
                                />
                            </div>
                            <div className="px-4 mb-4 mt-4">
                                <Button
                                    size="large"
                                    icon={<PopiconsFileDownloadLine />}
                                    onClick={() =>setShowExportModal(true)}
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
                                        router.visit("/agenda/tambah")
                                    }
                                >
                                    Tambah Data
                                </Button>
                            </div>
                        </div>
                        <div className="px-6 mb-4">
                            <DataTable 
                                data={agenda_list.filter((item)=>
                                    item.name.toLowerCase().includes(searchTerm) 
                                )} 
                                columns={columns} />
                        </div>
                    </div>
                </div>
            </div>
            {statusOpen && (
                <UbahStatusAgendaModal
                    data={selectedAgenda}
                    visible={statusOpen}
                    menu={"agenda"}
                    onClose={() => setStatusOpen(false)}
                />
            )}
            <Modal
                title="Konfirmasi Hapus Agenda"
                open={isDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Hapus"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Apakah Anda yakin ingin menghapus agenda{" "}
                    <strong>{selectedAgenda?.name}</strong>?
                </p>
                <p className="text-gray-500 mt-2">
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </Modal>
            <ExportAgendaModal
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
                menu={"agenda"}
                data={{}} // kosong karena ini untuk tambah, bukan edit
            />
        </DashboardLayout>
    );
}
