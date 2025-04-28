import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button, Input, Tag, Dropdown, Modal, message } from "antd";
import {
    PopiconsPlusLine,
    PopiconsEditLine,
    PopiconsLockOpenKeyLine,
    PopiconsBinLine,
    PopiconsEllipsisVerticalSolid,
} from "@popicons/react";
import { useState } from "react";
import FormUserModal from "@/Components/FormUserModal";
// import ResetPasswordModal from "@/Components/ResetPasswordModal";

export default function Index({ user_list }) {
    const { Search } = Input;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState("user");
    const [showFormModal, setShowFormModal] = useState(false);

    const onSearch = (value) => {
        console.log("Searching for:", value);
        // Implementasi pencarian pengguna
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setSelectedMenu("edit");
        setShowFormModal(true);

    };

    const showDeleteConfirm = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route("user-management.destroy", selectedUser.id), {
            onSuccess: () => {
                message.success("Pengguna berhasil dihapus");
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                message.error("Gagal menghapus pengguna");
            },
        });
        setIsDeleteModalOpen(false);
    };

    const handleResetPassword = (user) => {
        setSelectedUser(user);
        setSelectedMenu("reset-password");
        setShowFormModal(true);
        // Implementasi reset password
        // console.log(userId);
        // message.success("Link reset password telah dikirim ke email pengguna");
    };

    // Data breadcrumb
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "User Management" },
    ];
    console.log("User List:", user_list);

    const columns = [
        {
            title: "Nama Lengkap",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => {
                let color = "blue";
                if (role === "superadmin") color = "purple";
                if (role === "admin") color = "yellow";

                return (
                    <Tag color={color}>
                        {(role ?? "")
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                    </Tag>
                );
            },
            filters: [
                { text: "Superadmin", value: "superadmin" },
                { text: "Admin", value: "admin" },
                { text: "User", value: "user" },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: "Unit/Fakultas",
            dataIndex: "unit_kerja",
            key: "unit_kerja",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "aktif"
                            ? "green"
                            : status === "tidak aktif"
                              ? "red"
                              : "yellow"
                    }
                >
                     {(status ?? "")
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                </Tag>
            ),
            filters: [
                { text: "Aktif", value: "aktif" },
                { text: "Tidak Aktif", value: "tidak aktif" },
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
                                key: "edit",
                                icon: <PopiconsEditLine />,
                                label: "Edit Pengguna",
                                onClick: () => handleEdit(record),
                            },
                            {
                                key: "reset",
                                icon: <PopiconsLockOpenKeyLine />,
                                label: "Reset Password",
                                onClick: () => handleResetPassword(record),
                            },
                            {
                                key: "delete",
                                icon: <PopiconsBinLine />,
                                label: "Hapus Pengguna",
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
            <Head title="User Management" />
            <div className="bg-white shadow-sm sm:rounded-lg">
                <div className="px-6 mb-4 pt-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                <div className="px-6 flex justify-between items-center">
                    <h1 className="text-gray-900 font-semibold text-2xl">
                        Manajemen Pengguna
                    </h1>

                    <Button
                        type="primary"
                        size="large"
                        icon={<PopiconsPlusLine />}
                        onClick={() => {
                            setSelectedMenu("create");
                            setShowFormModal(true);
                        }}
                    >
                        Tambah Pengguna
                    </Button>
                </div>

                <div className="px-6 my-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                        <div className="flex items-center">
                            <div className="mr-4">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700">
                                    Kelola Akses Pengguna
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Halaman ini digunakan untuk mengelola akses
                                    pengguna website HUMAS UNS.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <Search
                            placeholder="Cari pengguna..."
                            allowClear
                            style={{ width: 300 }}
                            size="large"
                            onSearch={onSearch}
                        />
                    </div>

                    <DataTable
                        data={user_list}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>
            {/* Modal Konfirmasi Hapus */}
            <Modal
                title="Konfirmasi Hapus Pengguna"
                open={isDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Hapus"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Apakah Anda yakin ingin menghapus pengguna{" "}
                    <strong>{selectedUser?.name}</strong>?
                </p>
                <p className="text-gray-500 mt-2">
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </Modal>
            {showFormModal && (selectedMenu === "create" || selectedMenu === "edit" || selectedMenu === "reset-password") && (
                <FormUserModal
                    visible={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    menu={selectedMenu}
                    data={selectedUser} // ← kirim data user ke FormUserModal
                />
            )}           
            
        </DashboardLayout>
    );
}
