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
    TimePicker,
    Dropdown,
    Divider,
    Select,
} from "antd";
import { PopiconsPlusLine } from "@popicons/react";
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

const OPTIONS = ["Website Official", "Instagram", "Facebook", "X"];

export default function Agenda() {
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Agenda", href: "/agenda" },
        { title: "Formulir Agenda" },
    ];

    const [form] = Form.useForm();

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

    const [statusValue, setStatusValue] = useState(null);
    const items2 = [
        {
            key: "1",
            label: "Belum Terlaksana",
        },
        {
            key: "2",
            label: "Sudah Terlaksana",
        },
        {
            key: "3",
            label: "Dibatalkan",
        },
    ];

    const [selectedItems, setSelectedItems] = useState([]); // For multi-select input
    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o)); // Filter options for multi-select

    return (
        <DashboardLayout>
            <Head title="Formulir Agenda" />

            <div>
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="px-6 mb-4 pt-4">
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>
                    <h1 className="px-6  text-gray-900 font-semibold text-2xl mt-4">
                        Formulir Agenda
                    </h1>
                    <div className="px-6 py-4">
                        <Form
                            form={form}
                            name="validateOnly"
                            layout="vertical"
                            autoComplete="off"
                        >
                            <Form.Item
                                name="name"
                                label="Nama Agenda"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Masukkan Nama Agenda"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Deskripsi Agenda"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Masukkan Deskripsi Agenda"
                                    showCount
                                    maxLength={500}
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                    size="large"
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
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="time"
                                    label="Waktu Agenda"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <TimePicker
                                        placeholder="Masukkan Waktu"
                                        format="HH:mm"
                                        size="large"
                                        allowClear
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <Form.Item
                                    name="location"
                                    label="Lokasi"
                                    style={{ width: "50%" }}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder="Masukkan Lokasi"
                                        size="large"
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
                                    name="organizer"
                                    label="Penyelenggara"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <Input
                                        placeholder="Masukkan Penyelenggara"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="Status Agenda"
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
                                                    "status",
                                                    selectedLabel,
                                                );
                                                setStatusValue(selectedLabel);
                                            },
                                        }}
                                        trigger={["click"]}
                                    >
                                        <Button
                                            size="large"
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {statusValue ||
                                                "Pilih Status Agenda"}
                                        </Button>
                                    </Dropdown>
                                </Form.Item>
                            </div>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <Form.Item
                                    name="pic"
                                    label="Penanggung Jawab"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <Input
                                        placeholder="Masukkan Nama PIC Agenda"
                                        size="large"
                                    />
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
