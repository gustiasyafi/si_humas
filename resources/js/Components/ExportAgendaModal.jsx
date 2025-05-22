import { useState, useEffect, useRef } from "react";
import {
    Modal,
    Button,
    Form,
    notification,
    DatePicker,
    Divider,
    message,
    Spin,
} from "antd";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";
import axios from "axios";
import jsPDF from "jspdf";

const ExportAgendaModal = ({ visible, onClose, menu }) => {
    const canvasRef = useRef(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [generatedPages, setGeneratedPages] = useState([]);

    const selectedFormat = useWatch("format", form);
    const selectedDate = useWatch("date", form);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setGeneratedImage(null);
        }
    }, [form, visible]);

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    // Fungsi untuk generate gambar menggunakan Canvas API
    const generateImage = async (width = 1080, height = 1350) => {
        setImageLoading(true);

        // Mengambil nilai dari form
        const values = form.getFieldsValue();
        const date = values.date
            ? dayjs(values.date).format("YYYY-MM-DD")
            : null;

        //get list agenda
        const response = await axios.get("/api/agenda", {
            params: {
                date: date,
            },
        });
        const listAgenda = response.data;
        const chunkSize = 5; // max 5 agenda per halaman
        const pages = [];

        // Buat canvas
        for (let i = 0; i < listAgenda.length; i += chunkSize) {
            const chunk = listAgenda.slice(i, i + chunkSize);
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            // Gambar background putih
            const templateImage = new Image();
            templateImage.src = "/images/template-uns.png";

            await new Promise((resolve) => {
                templateImage.onload = () => {
                    // Gambar template ke seluruh canvas
                    ctx.drawImage(
                        templateImage,
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                    );
                    const centerX = canvas.width / 2;

                    ctx.font = "38px Times New Roman";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#ffffff"; // warna teks tanggal
                    const formattedDate = date
                        ? new Date(date)
                              .toLocaleDateString("id-ID", {
                                  weekday: "long", // Tambahkan hari
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                              })
                              .toUpperCase()
                        : "TIDAK DIPILIH";
                    ctx.fillText(formattedDate, centerX, 200);

                    // Tulis teks agenda di area putih (anggap area mulai Y=450 ke bawah)
                    let startY = 390; // area konten agenda di bawah gambar

                    ctx.textAlign = "center";
                    ctx.fillStyle = "#000000"; // warna teks

                    chunk.forEach((agenda, index) => {
                        const name = agenda.name;
                        const location = agenda.location;
                        const dateTimeString = `${agenda.date}T${agenda.time}`;
                        const date = new Date(dateTimeString);
                        const formattedDate = date.toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        });

                        ctx.font = "bold 42px Times New Roman";
                        ctx.fillText(name, centerX, startY);

                        ctx.font = "38px Times New Roman";
                        ctx.fillText(formattedDate, centerX, startY + 50);
                        ctx.fillText(location, centerX, startY + 100);

                        if (index < listAgenda.length - 2) {
                            ctx.strokeStyle = "#5a9bd4"; // warna garis abu-abu
                            ctx.lineWidth = 2;

                            ctx.beginPath();
                            ctx.moveTo(centerX - 450, startY + 130); // mulai dari kiri (agak panjang)
                            ctx.lineTo(centerX + 450, startY + 130); // sampai ke kanan
                            ctx.stroke();
                        }

                        startY += 180;
                    });

                    // Konversi canvas ke gambar
                    const imageUrl = canvas.toDataURL("image/png");
                    pages.push(imageUrl);
                    resolve();
                };
            });
        }
        setGeneratedImage(pages[0]);
        setGeneratedPages(pages); // <-- jika ingin semua halaman disimpan
        setImageLoading(false);

        return pages;
    };

    const generatePDF = async (pages, date) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [1080, 1350], // sama seperti ukuran canvas
        });

        pages.forEach((page, index) => {
            if (index > 0) pdf.addPage();
            pdf.addImage(page, "PNG", 0, 0, 1080, 1350);
        });

        const fileDate = date ? date.format("DD-MM-YYYY") : "undefined";
        pdf.save(`agenda-${fileDate}.pdf`);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (values.format === "png" || values.format === "pdf") {
                const pages = await generateImage();

                if (values.format === "pdf") {
                    await generatePDF(pages, selectedDate);
                    message.success("PDF berhasil diunduh");
                } else {
                    message.success("Berhasil generate gambar");
                }
            } else {
                if (menu === "user") {
                    await router.post(values, {
                        onSuccess: () => {
                            onClose();
                            message.success("Ekspor berhasil diunduh");
                        },
                        onError: (errors) => {
                            message.error(
                                "Gagal mengunduh. Cek kembali input kamu.",
                            );
                            console.log(errors);
                        },
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: "Gagal mengekspor",
                description: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
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
            {selectedFormat === "png" && (
                <div className="mt-4">
                    <Divider>Preview Gambar</Divider>
                    {imageLoading ? (
                        <div className="flex justify-center p-6">
                            <Spin tip="Generating image..." />
                        </div>
                    ) : generatedPages.length > 0 ? (
                        <div className="mt-4 space-y-6">
                            {generatedPages.map((page, index) => (
                                <div
                                    key={index}
                                    className="border rounded p-4 mb-4 relative bg-white shadow"
                                >
                                    <img
                                        src={page}
                                        alt={`Halaman ${index + 1}`}
                                        className="w-full h-auto"
                                        style={{
                                            maxHeight: "500px",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="text-center text-sm text-gray-500 mt-2">
                                            Halaman {index + 1}
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                const date = selectedDate
                                                    ? selectedDate.format(
                                                          "DD-MM-YYYY",
                                                      )
                                                    : "undefined";

                                                const link =
                                                    document.createElement("a");
                                                link.href = page;
                                                link.download = `agenda-${date}-halaman-${index + 1}.png`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 p-6 border border-dashed rounded">
                            Klik tombol "Simpan" untuk menghasilkan gambar
                            dengan data dari form
                        </div>
                    )}
                </div>
            )}

            {/* Canvas tersembunyi untuk membuat gambar */}
            <canvas
                ref={canvasRef}
                style={{ display: "none" }}
                width="800"
                height="600"
            />
        </Modal>
    );
};

export default ExportAgendaModal;
