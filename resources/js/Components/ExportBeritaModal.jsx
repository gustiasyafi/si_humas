import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, notification, Divider, message, Select, Row, Col, Spin } from "antd";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const ExportBeritaModal = ({ visible, onClose, menu }) => {
    const canvasRef = useRef(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const selectedFormat = useWatch("format", form);
    const unitKerja = useWatch("unit_kerja", form);
    const bulan = useWatch("bulan", form);
    const tahun = useWatch("tahun", form);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setGeneratedImage(null);
        }
    }, [form, visible]);

    const { Option } = Select;

    // Fungsi untuk generate gambar menggunakan Canvas API
    const generateImage = () => {
        setImageLoading(true);
        
        // Mengambil nilai dari form
        const values = form.getFieldsValue();
        const unitKerja = values.unit_kerja || "Tidak dipilih";
        const bulan = values.bulan ? 
            ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
             "Juli", "Agustus", "September", "Oktober", "November", "Desember"][values.bulan - 1] 
            : "Tidak dipilih";
        const tahun = values.tahun || "Tidak dipilih";
        
        // Buat canvas
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 500;
        const ctx = canvas.getContext("2d");
        
        // Gambar background putih
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Gambar border
        ctx.strokeStyle = "#7cb305";
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Tambahkan teks header
        ctx.fillStyle = "#000000";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("LAPORAN BERITA", canvas.width / 2, 80);
        
        // Tambahkan data dari form
        ctx.font = "bold 28px Arial";
        ctx.fillText("Unit Kerja: " + unitKerja, canvas.width / 2, 180);
        
        ctx.font = "24px Arial";
        ctx.fillText("Bulan: " + bulan, canvas.width / 2, 240);
        ctx.fillText("Tahun: " + tahun, canvas.width / 2, 290);
        
        // Tambahkan footer
        ctx.font = "italic 18px Arial";
        ctx.fillText("Dokumen dibuat pada: " + new Date().toLocaleString(), canvas.width / 2, 450);
        
        // Konversi canvas ke gambar
        const imageUrl = canvas.toDataURL("image/png");
        setGeneratedImage(imageUrl);
        setImageLoading(false);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (values.format === "png") {
                // Generate image client-side
                generateImage();
                message.success("Berhasil generate gambar");
            } else {
                // Handle PDF format (server-side)
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

    // Fungsi untuk download gambar
    const downloadImage = () => {
        if (generatedImage) {
            const bulanText = bulan ? 
                ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                 "Juli", "Agustus", "September", "Oktober", "November", "Desember"][bulan - 1] 
                : "undefined";
                
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = `berita-${unitKerja || 'undefined'}-${bulanText}-${tahun || 'undefined'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const options = [
        { label: "PNG", value: "png" },
        { label: "PDF", value: "pdf" },
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
            width={generatedImage ? 850 : 400}
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
                                onClick={() => {
                                    form.setFieldValue("format", option.value);
                                    setGeneratedImage(null);
                                }}
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
            
            {/* Bagian preview gambar */}
            {selectedFormat === 'png' && (
                <div className="mt-4">
                    <Divider>Preview Gambar</Divider>
                    {imageLoading ? (
                        <div className="flex justify-center p-6">
                            <Spin tip="Generating image..." />
                        </div>
                    ) : generatedImage ? (
                        <div className="mt-4">
                            <div className="border rounded p-2 mb-3">
                                <img 
                                    src={generatedImage} 
                                    alt="Generated Preview" 
                                    className="w-full h-auto" 
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="primary" onClick={downloadImage}>
                                    Download Gambar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 p-6 border border-dashed rounded">
                            Klik tombol "Simpan" untuk menghasilkan gambar dengan data dari form
                        </div>
                    )}
                </div>
            )}
            
            {/* Canvas yang tersembunyi untuk membuat gambar (tidak perlu ditampilkan) */}
            <canvas ref={canvasRef} style={{ display: 'none' }} width="800" height="500" />
        </Modal>
    );
};

export default ExportBeritaModal;
