import React, { useState, useRef } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import {
    Input,
    Space,
    Form,
    Button,
    DatePicker,
    Dropdown,
    Divider,
    Select,
    Upload,
    message,
} from "antd";
import { PopiconsPlusLine } from "@popicons/react";
import { InboxOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";

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

const options = [
    {
        label: "BNPT National Student Journalism Competition 2025",
        value: "BNPT National Student Journalism Competition 2025",
    },
    {
        label: "Inovasi Hijau: Solusi Berkelanjutan dari Penelitian Kampus",
        value: "Inovasi Hijau: Solusi Berkelanjutan dari Penelitian Kampus",
    },
];

const { Dragger } = Upload;
const props = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
    },
};

const labelRender = (props) => {
    const { label, value } = props;
    if (label) {
        return value;
    }
    return <span>No option match</span>;
};

const OPTIONS = ["Website Official", "Instagram", "Facebook", "X"];

export default function Agenda() {
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Berita", href: "/berita" },
        { title: "Formulir Berita" },
    ];

    const [form] = Form.useForm();
    const [isAgendaSelected, setIsAgendaSelected] = useState(false);
    const handleAgendaChange = (value) => {
        setIsAgendaSelected(!!value); // Enable other inputs if a value is selected
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

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
            label: "Pegabdian",
        },
    ]);
    const inputRef = useRef(null);
    const [newCategory, setNewCategory] = useState("");
    const handleAddCategory = () => {
        if (newCategory) {
            const newKey = (items1.length + 1).toString(); // Generate a new key
            setItems1([...items1, { key: newKey, label: newCategory }]); // Add new category
            setNewCategory(""); // Clear input
            setTimeout(() => {
                inputRef.current?.focus(); // Focus back on input
            }, 0);
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
    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o)); // Filter options for multi-select

    return (
        <DashboardLayout>
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
                            autoComplete="off"
                        >
                            <Form.Item
                                name="agenda"
                                label="Agenda"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Silakan Pilih Agenda!",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    labelRender={labelRender}
                                    placeholder="Pilih Agenda yang sudah ada"
                                    style={{
                                        width: "100%",
                                    }}
                                    options={options}
                                    onChange={handleAgendaChange}
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
                                    disabled={!isAgendaSelected}
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
                                    disabled={!isAgendaSelected}
                                />
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
                                        disabled={!isAgendaSelected}
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
                                        disabled={!isAgendaSelected}
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
                                >
                                    <Input
                                        placeholder="Masukkan Lokasi"
                                        size="large"
                                        disabled={!isAgendaSelected}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="priority"
                                    label="Prioritas Berita"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <Dropdown
                                        menu={{
                                            items: items2,
                                            onClick: (e) => {
                                                const selectedLabel =
                                                    items2.find(
                                                        (item) =>
                                                            item.key === e.key,
                                                    )?.label;
                                                form.setFieldsValue(
                                                    "priority",
                                                    selectedLabel,
                                                );
                                                setPriorityValue(selectedLabel);
                                            },
                                        }}
                                        trigger={["click"]}
                                        disabled={!isAgendaSelected}
                                    >
                                        <Button
                                            size="large"
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {priorityValue ||
                                                "Pilih Status Agenda"}
                                        </Button>
                                    </Dropdown>
                                </Form.Item>
                            </div>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <Form.Item
                                    name="upload"
                                    label="Upload File"
                                    style={{ width: "50%" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Silakan unggah file!",
                                        },
                                    ]}
                                >
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Klik atau seret file ke area ini
                                            untuk mengunggah
                                        </p>
                                        <p className="ant-upload-hint">
                                            Mendukung unggahan tunggal atau
                                            banyak file. Jangan unggah data
                                            perusahaan atau file terlarang
                                            lainnya.
                                        </p>
                                    </Dragger>
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
                                        disabled={!isAgendaSelected}
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
                                    <Button htmlType="reset">Reset</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
