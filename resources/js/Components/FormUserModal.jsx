import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Select,
    Form,
    notification,
    Input,
    Divider,
} from "antd";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

const { Option } = Select;

const FormUserModal = ({ visible, onClose, menu, data }) => {
    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (menu === "create") {
                await router.post(route(`user-management.store`), values, {
                    onSuccess: () => {
                        onClose();
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: "User berhasil ditambah!",
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal menyimpan",
                            text: "Cek kembali input kamu.",
                        });
                        console.log(errors);
                    },
                });
            }
        } catch (error) {
            notification.error({
                message: "Gagal mengubah status",
                description: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                menu === "create"
                    ? "Tambah Pengguna"
                    : menu === "edit"
                      ? "Edit Pengguna"
                      : "Reset Password"
            }
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Batal
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                >
                    Simpan
                </Button>,
            ]}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Divider style={{ borderColor: "#7cb305" }} />
                <Form.Item label="Nama Pengguna" name={"name"}>
                    <Input placeholder="Masukkan Nama Pengguna" size="large" />
                </Form.Item>
                <Form.Item label="Email" name={"email"}>
                    <Input placeholder="Masukkan Email Pengguna" size="large" />
                </Form.Item>
                <Form.Item label="Unit Kerja" name={"unit_kerja"}>
                    <Input placeholder="Masukkan Unit Kerja" size="large" />
                </Form.Item>
                <Form.Item label="Role" name={"role"}>
                    <Select placeholder="Pilih Role" size="large">
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Password" name={"password"}>
                    <Input placeholder="Masukkan Password" size="large" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormUserModal;
