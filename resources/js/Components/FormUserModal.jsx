import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Select,
    Form,
    Input,
    Divider,
    message
} from "antd";
import { router } from "@inertiajs/react";


const { Option } = Select;

const FormUserModal = ({ visible, onClose, menu }) => {
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
                        message.success("User berhasil ditambah!");
                    },
                    onError: (errors) => {
                        message.error("Gagal menyimpan. Cek kembali input kamu.");
                        console.log(errors);
                    },
                });
            }
        } catch (error) {
            message.error(error.response?.data?.message || error.message);
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
                <Form.Item
                    label="Nama Pengguna"
                    name={"name"}
                    rules={[
                        {
                            required: true,
                            message: "Nama Pengguna tidak boleh kosong!",
                        },
                    ]}
                >
                    <Input placeholder="Masukkan Nama Pengguna" size="large" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name={"email"}
                    rules={[
                        {
                            required: true,
                            message: "Email tidak boleh kosong!",
                        },
                    ]}
                >
                    <Input placeholder="Masukkan Email Pengguna" size="large" />
                </Form.Item>
                <Form.Item
                    label="Unit Kerja"
                    name={"unit_kerja"}
                    rules={[
                        {
                            required: true,
                            message: "Unit Kerja tidak boleh kosong!",
                        },
                    ]}
                >
                    <Input placeholder="Masukkan Unit Kerja" size="large" />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name={"role"}
                    rules={[
                        { required: true, message: "Role tidak boleh kosong!" },
                    ]}
                >
                    <Select placeholder="Pilih Role" size="large">
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name={"password"}
                    rules={[
                        {
                            required: true,
                            message: "Password tidak boleh kosong!",
                        },
                    ]}
                >
                    <Input.Password placeholder="Masukkan Password" size="large" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormUserModal;
