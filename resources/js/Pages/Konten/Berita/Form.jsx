import React, { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import {
    Input,
    Space,
    Form,
    Button,
    DatePicker,
    Divider,
    Select,
    Upload,
} from "antd";
import { PopiconsPlusLine } from "@popicons/react";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
// import ReactQuill from "react-quill";
// import 'react-quill/dist/quill.snow.css'; // Import the styles

// const props = {
//     name: "file",
//     multiple: true,
//     action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
//     onChange(info) {
//         const { status } = info.file;
//         if (status !== "uploading") {
//             console.log(info.file, info.fileList);
//         }
//         if (status === "done") {
//             message.success(`${info.file.name} file uploaded successfully.`);
//         } else if (status === "error") {
//             message.error(`${info.file.name} file upload failed.`);
//         }
//     },
//     onDrop(e) {
//         console.log("Dropped files", e.dataTransfer.files);
//     },
// };

const PUBLISH_OPTIONS = ["Website Official", "Instagram", "Facebook", "X"];

export default function FormBerita({
    agendaList = [],
    berita = null,
    type = "create",
}) {
    const isEdit = type === "edit";
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Berita", href: "/berita" },
        { title: "Formulir Berita" },
    ];

    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        id: null,
    });
    // const [isAgendaSelected, setIsAgendaSelected] = useState(false);
    const handleAgendaChange = (value) => {
        setFormData({
            ...formData,
            agenda_id: value,
        });
        // setIsAgendaSelected(!!value); // Enable other inputs if a value is selected
    };

    const SubmitButton = ({ form, children }) => {
        const [submittable, setSubmittable] = React.useState(false);
        // Watch all values
        const values = Form.useWatch([], form);

        React.useEffect(() => {
            form.validateFields({
                validateOnly: true,
            })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const onSearch = (value) => {
        console.log("search:", value);
    };

    const [fileList, setFileList] = useState([]);

    const [categoryValue, setCategoryValue] = useState(null);

    const [items1, setItems1] = useState([
        {
            key: "1",
            label: "Mahasiswa UNS",
        },
        {
            key: "2",
            label: "Kerja Sama UNS",
        },
        {
            key: "3",
            label: "Produk dan Penelitian",
        },
        {
            key: "4",
            label: "Pengabdian",
        },
    ]);
    const inputRef = useRef(null);
    const [newCategory, setNewCategory] = useState("");
    const handleAddCategory = () => {
        if (newCategory) {
            // Menambahkan kategori baru ke dalam items1
            setItems1((prevItems) => [
                ...prevItems,
                { key: String(prevItems.length + 1), label: newCategory },
            ]);
            setNewCategory(""); // Reset input setelah kategori ditambahkan
        }
    };

    const [priorityValue, setPriorityValue] = useState(null);
    const items2 = [
        {
            key: "1",
            label: "Tinggi",
        },
        {
            key: "2",
            label: "Sedang",
        },
        {
            key: "3",
            label: "Rendah",
        },
    ];

    const [selectedItems, setSelectedItems] = useState([]); // For multi-select input
    const filteredOptions = PUBLISH_OPTIONS.filter(
        (o) => !selectedItems.includes(o),
    ); // Filter options for multi-select
    const onFinish = async (values) => {
        try {
            console.log("Form submitted:", values);
            const submitData = new FormData();
            const publishValue = values.publish.join(",");
            console.log(values);
            console.log(form.getFieldsValue());
            submitData.append("agenda_id", values.agenda_id || "");
            submitData.append("title", values.berita);
            submitData.append("description", values.description);
            submitData.append("date", values.date.format("YYYY-MM-DD"));
            submitData.append("category", values.category);
            submitData.append("link", values.link || "");
            submitData.append("priority", values.priority);
            submitData.append("publish", publishValue);
            submitData.append("notes", values.notes || "");

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    submitData.append("files[]", file.originFileObj);
                }
            });

            const existingFileIds = fileList
                .filter((file) => !file.originFileObj && file.id) // file lama
                .map((file) => file.id);

            existingFileIds.forEach((id) => {
                submitData.append("existing_files[]", id);
            });

            if (isEdit) {
                router.post(route("berita.update", berita.id), submitData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    forceFormData: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: "Berita berhasil disimpan!",
                        });
                        form.resetFields();
                        setFormData({ agenda_id: null });
                        // setIsAgendaSelected(false);
                        setCategoryValue(null);
                        setPriorityValue(null);
                        setSelectedItems([]);
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
            } else {
                router.post(route("berita.store"), submitData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: "Berita berhasil disimpan!",
                        });
                        form.resetFields();
                        setFormData({ agenda_id: null });
                        // setIsAgendaSelected(false);
                        setCategoryValue(null);
                        setPriorityValue(null);
                        setSelectedItems([]);
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
            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan!",
                text: "Silakan coba lagi.",
            });
            console.error("Error onFinish:", error);
        }
    };

    useEffect(() => {
        if (isEdit && berita) {
            const publishMediaArray = berita.publish.split(", ") || [];
            form.setFieldsValue({
                agenda_id: berita.agenda?.id || null,
                berita: berita.title,
                description: berita.description,
                date: dayjs(berita.date),
                category: berita.category,
                link: berita.link || null,
                priority: berita.priority,
                publish: publishMediaArray,
            });
            const mappedFileList = berita.files.map((file, index) => ({
                uid: String(index),
                id: file.id,
                name: file.file_name,
                status: "done",
                url: `/storage/${file.file_path}`,
            }));
            setFileList(mappedFileList);
        }
    }, [berita, form, isEdit, type]);

    return (
        <>
            <Head title="Formulir Berita" />

            <div>
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="px-6 mb-4 pt-4">
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>
                    <h1 className="px-6  text-gray-900 font-semibold text-2xl mt-4">
                        Formulir Berita
                    </h1>
                    <div className="px-6 py-4">
                        <Form
                            form={form}
                            name="validateOnly"
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="agenda_id"
                                label="Agenda"
                                style={{ width: "100%" }}
                            >
                                <Select
                                    showSearch
                                    size="large"
                                    disabled={false}
                                    placeholder="Pilih Agenda yang sudah ada"
                                    optionFilterProp="label"
                                    onSearch={onSearch}
                                    style={{
                                        width: "100%",
                                    }}
                                    options={agendaList.map((agenda) => ({
                                        label: agenda.name,
                                        value: agenda.id,
                                    }))}
                                    value={formData.agenda_id} // <- tambahkan ini!
                                    onChange={(value) => {
                                        handleAgendaChange(value);
                                        console.log(
                                            "Selected Agenda ID:",
                                            value,
                                        ); // Debugging line
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="berita"
                                label="Judul Berita"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Masukkan Judul Berita"
                                    size="large"
                                    disabled={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Isi Berita atau Press Release"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Masukkan Deskripsi Agenda"
                                    showCount
                                    maxLength={500}
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                    size="large"
                                    disabled={false}
                                />
                                {/* <ReactQuill 
                                    value={value}
                                    onChange={setValue}
                                /> */}
                            </Form.Item>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <Form.Item
                                    name="date"
                                    label="Tanggal Agenda"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <DatePicker
                                        onChange={onChange}
                                        style={{ width: "100%" }}
                                        format="DD/MM/YYYY"
                                        placeholder="Pilih tanggal"
                                        size="large"
                                        disabled={false}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="category"
                                    label="Kategori"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Silakan pilih atau tambahkan kategori!",
                                        },
                                    ]}
                                    style={{ width: "50%" }}
                                >
                                    <Select
                                        size="large"
                                        style={{ width: "100%" }}
                                        placeholder="Pilih atau Tambahkan Kategori"
                                        value={categoryValue}
                                        disabled={false}
                                        onChange={(value) =>
                                            setCategoryValue(value)
                                        } // Update selected value
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                        margin: "8px 0",
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                        padding: "0 8px 4px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Tambahkan kategori baru"
                                                        ref={inputRef}
                                                        value={newCategory}
                                                        onChange={(e) =>
                                                            setNewCategory(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onKeyDown={(e) =>
                                                            e.stopPropagation()
                                                        } // Prevent dropdown from closing on Enter
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={
                                                            <PopiconsPlusLine />
                                                        }
                                                        onClick={
                                                            handleAddCategory
                                                        }
                                                    >
                                                        Tambah
                                                    </Button>
                                                </Space>
                                            </>
                                        )}
                                        options={items1.map((item) => ({
                                            label: item.label,
                                            value: item.label, // Use label as the value
                                        }))}
                                    />
                                </Form.Item>
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <Form.Item
                                    name="link"
                                    label="Link (jika sudah terpublikasi media lain)"
                                    style={{ width: "50%" }}
                                    rules={[
                                        {
                                            required: false, // Tidak wajib diisi
                                        },
                                        {
                                            pattern:
                                                /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}([\\/\w .-]*)*\/?$/, // Regex untuk validasi URL tanpa http
                                            message:
                                                "Mohon masukkan URL yang valid",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Masukkan Lokasi"
                                        size="large"
                                        disabled={false}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="priority"
                                    label="Prioritas Berita"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <Select
                                        placeholder="Pilih Prioritas Berita"
                                        size="large"
                                        value={priorityValue}
                                        disabled={false}
                                        onChange={(value) =>
                                            setPriorityValue(value)
                                        } // Update selected value
                                        options={items2.map((item) => ({
                                            label: item.label,
                                            value: item.label, // Use label as the value
                                        }))}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <Form.Item
                                    name="upload"
                                    label="Upload File"
                                    style={{ width: "50%" }}
                                >
                                    <Upload
                                        multiple
                                        listType="picture"
                                        beforeUpload={() => false}
                                        fileList={fileList}
                                        onChange={({ fileList }) =>
                                            setFileList(fileList)
                                        }
                                    >
                                        <Button
                                            type="primary"
                                            icon={<UploadOutlined />}
                                        >
                                            Upload
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    name="publish"
                                    label="Media Publikasi"
                                    style={{ width: "50%" }} // Match the width of other inputs
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Silakan pilih media publikasi",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        mode="multiple"
                                        placeholder="Pilih beberapa media"
                                        value={selectedItems}
                                        disabled={false}
                                        onChange={setSelectedItems} // Update selected items
                                        style={{
                                            width: "100%", // Ensure it matches the width of the Form.Item
                                        }}
                                        options={filteredOptions.map(
                                            (item) => ({
                                                value: item,
                                                label: item,
                                            }),
                                        )}
                                    />
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Space>
                                    <SubmitButton form={form}>
                                        Submit
                                    </SubmitButton>
                                    <Button
                                        htmlType="reset"
                                        onClick={() => {
                                            form.resetFields();
                                            setFormData({ agenda_id: null });
                                            // setIsAgendaSelected(false);
                                            setCategoryValue(null);
                                            setPriorityValue(null);
                                            setSelectedItems([]);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
