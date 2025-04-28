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

const FormUserModal = ({ visible, onClose, menu, data }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (menu === "edit" && data) {
                form.setFieldsValue({
                    name: data.name,
                    email: data.email,
                    unit_kerja: data.unit_kerja,
                    role: data.role,
                });
            } else if (menu === "reset-password" && data){
                form.resetFields();
            } else {
                form.resetFields();
            }
        }
    }, [visible, menu, data, form]);
    
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
                    onError: () => {
                        message.error("Gagal menambah user.");
                    },
                });
            } else if (menu === "edit") {
                console.log("Updating user data with id:", data.id); 
                await router.put(route('user-management.update', data.id), values, {
                    onSuccess: () => {
                        onClose();
                        message.success("User berhasil diupdate!");
                        
                    },
                    onError: () => {
                        message.error("Gagal mengupdate user.");
                    },
                });
            } else if (menu === "reset-password"){
                await router.put(route('user-management.reset-password', data.id), values, {
                    onSuccess: () => {
                        onClose();
                        message.success("Password berhasil direset!");
                    },
                    onError: () => {
                        message.error("Gagal mereset password.");
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
            open={visible}
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
                {menu !== "reset-password" && (
                    <>
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
                    </>
                )}
                {menu === "create" && (
                    <Form.Item
                        label="Password"
                        name={"password"}
                        rules={[{ required: true, message: "Password tidak boleh kosong!" }]}
                    >
                        <Input.Password placeholder="Masukkan Password" size="large" />
                    </Form.Item>
                )}
                {menu === "reset-password" && (
                    <>
                        <Form.Item
                            label="Password Baru"
                            name={"password"}
                            rules={[
                                { required: true, message: "Password tidak boleh kosong!" },
                                { min: 8, message: "Password minimal 8 karakter!" },
                            ]}
                        >
                            <Input.Password placeholder="Masukkan Password Baru" size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Konfirmasi Password"
                            name={"password_confirmation"}
                            dependencies={['password']}
                            rules={[
                                { required: true, message: "Konfirmasi password tidak boleh kosong!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Password tidak cocok!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Konfirmasi Password" size="large" />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default FormUserModal;
