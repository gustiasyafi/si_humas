import { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Form,
    Input,
    Divider,
    message
} from "antd";
import { router } from "@inertiajs/react";


const FormUnitKerjaModal = ({ visible, onClose, menu, data }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (menu === "edit" && data) {
                form.setFieldsValue({
                    name: data.name,
                });
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
                await router.post(route("unit-kerja.store"), values, {
                    onSuccess: () => {
                        onClose();
                        message.success("Unit Kerja berhasil ditambah!");
                    },
                    onError: () => {
                        message.error("Gagal menambah Unit Kerja.");
                    },
                });
            } else if (menu === "edit") {
                console.log("Updating Unit Kerja with id:", data.id);
                await router.put(route("unit-kerja.update", data.id), values, {
                    onSuccess: () => {
                        onClose();
                        message.success("Unit Kerja berhasil diupdate!");
                    },
                    onError: () => {
                        message.error("Gagal mengupdate Unit Kerja.");
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
                    ? "Tambah Unit Kerja"
                    : "Edit Pengguna"
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
            <Form layout="vertical" form={form} onFinish={handleSubmit} >
                <Divider style={{ borderColor: "#7cb305" }} />
                        <Form.Item
                            label="Unit Kerja"
                            name={"name"}
                            rules={[
                                {
                                    required: true,
                                    message: "Unit Kerja tidak boleh kosong!",
                                },
                            ]}
                        >
                            <Input placeholder="Masukkan Unit Kerja" size="large" />
                        </Form.Item>                
            </Form>
        </Modal>
    );
};

export default FormUnitKerjaModal;
