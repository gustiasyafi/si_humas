import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button, Input, Dropdown, message, Modal } from "antd";
import {
    PopiconsEditLine,
    PopiconsEllipsisVerticalSolid,
    PopiconsPlusLine,
    PopiconsBinLine,
} from "@popicons/react";
import { useState } from "react";
import FormUnitKerjaModal from "@/Components/FormUnitKerjaModal";
import { router } from "@inertiajs/react";

export default function Index({ unit_kerja_list }) {
    const { Search } = Input;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMenu, setSelectedMenu] = useState("user");
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedUnitKerja, setSelectedUnitKerja] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const onSearch = (value) => {
        setCurrentPage(1);
        setSearchTerm(value.toLowerCase());
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const breadcrumbItems = [
        { title: "Beranda", href: "/beranda" },
        { title: "Master Data" },
        { title: "Unit Kerja" },
    ];

    const handleEdit = (unitKerja) => {
        setSelectedMenu("edit");
        setShowFormModal(true);
        setSelectedUnitKerja(unitKerja);
    };

    const showDeleteConfirm = (unitKerja) => {
        setSelectedUnitKerja(unitKerja);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        // Cek apakah unit kerja memiliki pengguna terkait
        if (selectedUnitKerja.users && selectedUnitKerja.users.length > 0) {
            // Update unit_kerja_id menjadi null di tabel users
            router.put(
                route("users.updateUnitKerja", selectedUnitKerja.id),
                { unit_kerja_id: null },
                {
                    onSuccess: () => {
                        // Jika berhasil update, hapus unit kerja
                        deleteUnitKerja();
                    },
                    onError: () => {
                        message.error("Gagal memperbarui pengguna");
                    },
                },
            );
        } else {
            // Jika tidak ada pengguna terkait, langsung hapus unit kerja
            deleteUnitKerja();
        }
    };

    const deleteUnitKerja = () => {
        // Hapus unit kerja
        router.delete(route("unit-kerja.destroy", selectedUnitKerja.id), {
            onSuccess: () => {
                message.success("Unit Kerja berhasil dihapus");
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                message.error("Gagal menghapus unit kerja");
            },
        });
    };

    const columns = [
        {
            title: "No",
            key: "index",
            render: (text, record, index) =>
                (currentPage - 1) * pageSize + index + 1,
            width: 50,
        },
        {
            title: "Nama Unit Kerja",
            dataIndex: "name",
            key: "unit_kerja",
            sorter: (a, b) => a.name.localeCompare(b.title),
        },

        {
            title: "Aksi",
            key: "action",
            width: 70,
            render: (record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                icon: <PopiconsEditLine />,
                                label: "Edit Data",
                                onClick: () => handleEdit(record),
                            },
                            {
                                key: "delete",
                                icon: <PopiconsBinLine />,
                                label: "Hapus Unit Kerja",
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
            <Head title="Unit Kerja" />

            <div>
                <div className="">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 mb-4 pt-4">
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>
                        <h1 className="px-6  text-gray-900 font-semibold text-2xl mt-4 mb-8">
                            Unit Kerja
                        </h1>
                        <div className="px-6 mb-6 flex justify-between items-center">
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
                                    onClick={() => {
                                        setSelectedMenu("create");
                                        setShowFormModal(true);
                                    }}
                                >
                                    Tambah Data
                                </Button>
                            </div>
                        </div>
                        <div className="px-6 mb-4">
                            <DataTable
                                dataSource={unit_kerja_list.filter((item) =>
                                    item.name
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
            <Modal
                title="Konfirmasi Hapus Unit Kerja"
                open={isDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Hapus"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Apakah Anda yakin ingin menghapus unit kerja{" "}
                    <strong>{selectedUnitKerja?.name}</strong>?
                </p>
                <p className="text-gray-500 mt-2">
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </Modal>
            {showFormModal &&
                (selectedMenu === "create" || selectedMenu === "edit") && (
                    <FormUnitKerjaModal
                        visible={showFormModal}
                        onClose={() => setShowFormModal(false)}
                        menu={selectedMenu}
                        data={selectedUnitKerja}
                    />
                )}
        </DashboardLayout>
    );
}
