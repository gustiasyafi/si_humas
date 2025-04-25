import { useState } from "react";
import { Modal, Button, Select, Form, message, Input } from "antd";
import { router } from "@inertiajs/react";

const { Option } = Select;
const { TextArea } = Input;

const UbahStatusBeritaModal = ({ visible, onClose, menu, data }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        console.log(values);
        console.log(data.id);
        try {
            if (menu === "berita") {
                await router.put(
                    route(`berita.update-status`, data.id),
                    values,
                    {
                        onSuccess: () => {
                            onClose();
                            message.success("Status berhasil diperbarui!");
                        },
                        onError: (errors) => {
                            message.error("Gagal menyimpan. Cek kembali input kamu.");
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
            title="Ubah Status Berita"
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
                <Form.Item
                    label="Pilih Status Baru"
                    name={"status"}
                    initialValue={data.status}
                >
                    <Select placeholder="Pilih status baru" size="large">
                        <Option value="Diajukan">Diajukan</Option>
                        <Option value="Diproses">Diproses</Option>
                        <Option value="Ditolak">Ditolak</Option>
                        <Option value="Revisi">Perlu Revisi</Option>
                        <Option value="Dipublikasikan">Dipublikasikan</Option>
                    </Select>
                </Form.Item>
                <Form.Item name={"notes"}>
                    <TextArea
                        rows={4}
                        placeholder="Masukkan komentar Berita disini"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UbahStatusBeritaModal;
