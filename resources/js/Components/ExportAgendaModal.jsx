import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, notification, DatePicker, Divider, message, Spin } from "antd";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const ExportAgendaModal = ({ visible, onClose, menu }) => {
    const canvasRef = useRef(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const selectedFormat = useWatch("format", form);
    const selectedDate = useWatch("date", form);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setGeneratedImage(null);
        }
    }, [visible]);

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    // Fungsi untuk generate gambar menggunakan Canvas API
    const generateImage = () => {
        setImageLoading(true);
        
        // Mengambil nilai dari form
        const values = form.getFieldsValue();
        const date = values.date ? values.date.format("DD MMMM YYYY") : "Tidak dipilih";
        
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
        ctx.fillText("LAPORAN AGENDA", canvas.width / 2, 80);
        
        // Tambahkan data dari form
        ctx.font = "bold 28px Arial";
        ctx.fillText("Tanggal Agenda: " + date, canvas.width / 2, 200);
        
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
                // Handle format lainnya (server-side)
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
            const date = selectedDate ? selectedDate.format("DD-MM-YYYY") : "undefined";
            
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = `agenda-${date}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Menambahkan PNG ke opsi format
    const options = [
        { label: "PNG", value: "png" }, 
        { label: "PDF", value: "pdf" },
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
            width={generatedImage ? 850 : 400} // Memperlebar modal saat ada gambar
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
                                onClick={() => {
                                    form.setFieldValue("format", option.value);
                                    setGeneratedImage(null); // Reset gambar saat format berubah
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
            
            {/* Canvas tersembunyi untuk membuat gambar */}
            <canvas ref={canvasRef} style={{ display: 'none' }} width="800" height="500" />
        </Modal>
    );
};

export default ExportAgendaModal;