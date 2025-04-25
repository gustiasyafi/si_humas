import { useState, useEffect } from "react";
import { Modal, Button, Form, notification, Divider, message, Select, Row, Col } from "antd";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const ExportBeritaModal = ({ visible, onClose, menu }) => {
    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const selectedFormat = useWatch("format", form);

    const { Option } = Select;
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (menu === "user") {
                await router.post(values, {
                    onSuccess: () => {
                        onClose();
                        message.success("Ekspor berhasil diunduh");
                    },
                    onError: (errors) => {
                        message.error("Gagal mengunduh. Cek kembali input kamu.");
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
        { label: "CSV", value: "csv" },
    ];

    return (
        <Modal
            title="Ekspor Berita"
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
                    bulan: dayjs().month() + 1,
                    tahun: dayjs().year(),
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
                    name="unit_kerja"
                    label="Unit Kerja"
                    rules={[{ required: true }]}
                    >
                        <Select placeholder="Pilih Unit Kerja" size="large">
                            <Option value="Fakultas">Fakultas</Option>
                            <Option value="UPT">UPT</Option>
                            <Option value="PUSDI">PUSDI</Option>
                        </Select>
                </Form.Item>
                
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="bulan"
                            label="Bulan"
                            rules={[{ required: true, message: "Pilih bulan terlebih dahulu" }]}
                        >
                            <Select placeholder="Pilih Bulan" size="large">
                                {[
                                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                                ].map((month, index) => (
                                    <Option key={index + 1} value={index + 1}>
                                        {month}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="tahun"
                            label="Tahun"
                            rules={[{ required: true, message: "Pilih tahun terlebih dahulu" }]}
                        >
                            <Select placeholder="Pilih Tahun" size="large">
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                
            </Form>
        </Modal>
    );
};

export default ExportBeritaModal;
