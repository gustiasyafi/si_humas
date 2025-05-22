import { useState } from "react";
import { Modal, Button, Select, Form, message, Input } from "antd";
import { router } from "@inertiajs/react";
// import Swal from "sweetalert2";

const { Option } = Select;
const { TextArea } = Input;

const UbahStatusAgendaModal = ({ visible, onClose, menu, data }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // const [status, setStatus] = useState(data?.status || "");

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
            title="Ubah Status Agenda"
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
                <Form.Item
                    label="Pilih Status Baru"
                    name={"status"}
                    initialValue={data.status}
                    style={{ marginBottom: 12 }} 
                >
                    <Select placeholder="Pilih status baru" size="large">
                        <Option value="Dipublikasikan">Dipublikasikan</Option>
                        <Option value="Ditolak">Ditolak</Option>
                    </Select>
                </Form.Item>
                <Form.Item 
                    name={"notes"}
                    label="Komentar"
                    style={{ marginBottom: 0 }}
                >
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
