import { useState, useEffect } from "react";
import { Modal, Button, Form, Divider, Select, Row, Col, message } from "antd";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const ExportBeritaModal = ({ visible, onClose, unit_kerja_list }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [unitKerja, setUnitKerja] = useState(null);


    const selectedFormat = useWatch("format", form);

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [form, visible]);

    const { Option } = Select;

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/berita/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    unit_kerja: values.unit_kerja || null,
                    bulan: values.bulan,
                    tahun: values.tahun,
                    format: values.format,
                }),
            });
    
            if (!response.ok) throw new Error('Gagal mengekspor data.');
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `berita_export.${values.format}`;
            a.click();
            a.remove();
    
            message.success('Ekspor berhasil diunduh');
            onClose();
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    

    const options = [
        { label: "Excel", value: "xlsx" },
        { label: "CSV", value: "csv" },
    ];

    return (
        <Modal
            title="Ekspor Berita"
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
                                onClick={() => form.setFieldValue("format", option.value)}
                                className={`px-4 py-2 rounded-md border transition-all duration-150 ${
                                    selectedFormat === option.value
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white text-gray-700"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {option.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </Form.Item>
                
                <Form.Item
                    name="unit_kerja"
                    label="Unit Kerja"
                    rules={[{ required: false }]}
                    >
                        <Select 
                                showSearch
                                optionFilterProp="children"
                                placeholder="Pilih Unit Kerja" 
                                size="large"
                                value={unitKerja} 
                                onChange={(value) => setUnitKerja(value)}
                                filterOption={(input, option) =>
                                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {(unit_kerja_list || []).map((unit) => (
                                    <Option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </Option>
                                ))}
                            </Select>
                </Form.Item>
                
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="bulan"
                            label="Bulan"
                            rules={[{ required: false }]}
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
                            rules={[{ required: false }]}
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
