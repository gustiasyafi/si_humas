import { useState, useEffect } from "react";
import { Modal, Button, Form, notification, DatePicker, Divider } from "antd";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const ExportAgendaModal = ({ visible, onClose, menu }) => {
    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const selectedFormat = useWatch("format", form);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (menu === "user") {
                await router.post(values, {
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

    const options = [
        { label: "Excel", value: "excel" },
        { label: "PDF", value: "pdf" },
        { label: "CSV", value: "csv" },
    ];

    return (
        <Modal
            title="Ekspor Agenda"
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
            <Form
                layout="vertical"
                form={form}
                initialValues={{
                    date: dayjs(),
                }}
                onFinish={handleSubmit}
            >
                <Divider style={{ borderColor: "#7cb305" }} />

                <Form.Item
                    name="format"
                    label="Format"
                    rules={[{ required: true }]}
                >
                    <div className="flex gap-4">
                        {options.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() =>
                                    form.setFieldValue("format", option.value)
                                }
                                className={`px-4 py-2 rounded-md border transition-all duration-150 ${
                                    selectedFormat === option.value
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white text-gray-700"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {/* <span className="inline-block w-3 h-3 border-2 border-gray-400 rounded-full" /> */}

                                    {option.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Tanggal Agenda"
                    rules={[{ required: true }]}
                >
                    <DatePicker
                        onChange={onChange}
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder="Pilih tanggal"
                        size="large"
                        defaultValue={dayjs(new Date())}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ExportAgendaModal;
