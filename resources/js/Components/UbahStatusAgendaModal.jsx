import { useState } from "react";
import { Modal, Button, Select, Form, notification, Input } from "antd";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

const { Option } = Select;
const { TextArea } = Input;

const UbahStatusAgendaModal = ({ visible, onClose, menu, data }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        console.log(values);
        console.log(data.id);
        try {
            if (menu === "agenda") {
                await router.put(
                    route(`agenda.update-status`, data.id),
                    values,
                    {
                        onSuccess: () => {
                            onClose();
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil!",
                                text: "Status Agenda berhasil diperbarui!",
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
                    },
                );
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
            title="Ubah Status Agenda"
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
                        <Option value="Disetujui">Dipublikasikan</Option>
                    </Select>
                </Form.Item>
                <Form.Item name={"notes"}>
                    <TextArea
                        rows={4}
                        placeholder="Masukkan komentar Agenda disini"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UbahStatusAgendaModal;
