import { useState } from "react";
import { Modal, Button, Form, message, Input, Divider } from "antd";
import { router } from "@inertiajs/react";
// import Swal from "sweetalert2";


const ResetPasswordModal = ({ visible, onClose, menu, data }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        if (!data || !data.id) {
            message.error("Data pengguna tidak ditemukan.");
            return;
        }
    
        setLoading(true);
        const payload = {
            password: values.password,
            password_confirmation: values.confirmPassword,
        };
    
        try {
            if (menu === "user-management") {
                await router.put(
                    route(`user-management.reset-password`, data.id),
                    payload,
                    {
                        onSuccess: () => {
                            form.resetFields();
                            onClose();
                            message.success("Password berhasil direset!");
                            router.push(route('user-management.index')); 
                        },
                        onError: (errors) => {
                            message.error("Gagal reset password. Cek kembali input kamu.");
                            console.log(errors);
                        },
                    },
                );
            }
        } catch (error) {
            message.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Reset Password"
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
                    <Form.Item 
                        label="Password Baru"
                        name={"password"}
                        rules={[
                            {
                                required: true,
                                message: "Password tidak boleh kosong!",
                            },
                        ]}>
                        <Input.Password
                            size="large"
                            placeholder="Masukkan password baru"
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Konfirmasi Password Baru"
                        dependencies={["password"]}
                        name={"confirmPassword"}
                        rules={[
                            {
                                required: true,
                                message: "Konfirmasi Password tidak boleh kosong!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Konfirmasi password tidak sama!'));
                                },
                            }),
                         ]}>
                        <Input.Password
                            size="large"
                            placeholder="Masukkan konfirmasi password baru"
                        />
                    </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResetPasswordModal;
