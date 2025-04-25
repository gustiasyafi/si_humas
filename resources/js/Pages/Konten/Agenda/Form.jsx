import React, { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import {
    Input,
    Space,
    Form,
    Button,
    DatePicker,
    TimePicker,
    Divider,
    Select,
    message
} from "antd";
import { PopiconsPlusLine } from "@popicons/react";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";

const PUBLISH_OPTIONS = ["Website Official", "Instagram", "Facebook", "X"];

export default function FormAgenda({ agenda = null, type = "create" }) {
    const isEdit = type === "edit";
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

    const onClose = () => {
        // misalnya balik ke halaman list agenda
        router.visit("/agenda");
    };

    const onFinish = async (values) => {
        try {
            const publishValue = values.publish.join(", ");
            const formData = {
                name: values.name,
                description: values.description,
                date: values.date.format("YYYY-MM-DD"),
                time: values.time.format("HH:mm"),
                location: values.location,
                category: values.category,
                organizer: values.organizer,
                status_agenda: values.status_agenda,
                pic: values.pic,
                publish: publishValue,
                notes: values.notes || "",
            };
    
            if (type === "edit" && agenda?.id) {
                router.put(route("agenda.update", agenda.id), formData, {
                    onSuccess: () => {
                        onClose();
                        message.success("Agenda berhasil diperbarui!");
                    },
                    onError: (errors) => {
                        message.error("Gagal menyimpan. Cek kembali input kamu.");
                        console.log(errors);
                    },
                });
            } else {
                router.post(route("agenda.store"), formData, {
                    onSuccess: () => {
                        form.resetFields();
                        message.success("Agenda berhasil disimpan!");
                    },
                    onError: (errors) => {
                        message.error("Gagal menyimpan agenda. Cek kembali input kamu.");
                        console.log(errors);
                    },
                });
            }
        } catch {
            message.error("Terjadi kesalahan. Silakan coba lagi.");
        }
    };
    

    useEffect(() => {
        if (isEdit && agenda) {
            const publishMediaArray = agenda.publish.split(", ") || [];
            form.setFieldsValue({
                name: agenda.name,
                description: agenda.description,
                date: dayjs(agenda.date),
                time: dayjs(agenda.time, "HH:mm"),
                location: agenda.location,
                category: agenda.category,
                organizer: agenda.organizer,
                pic: agenda.pic,
                publish: publishMediaArray || [],
                status_agenda: agenda.status_agenda,
                notes: agenda.notes || "",
            });
            setCategoryValue(agenda.category);
            setStatusValue(agenda.status_agenda);
        }
    }, [agenda, form, type]);

    return (
        <>
            <Head title={!isEdit ? "Formulir Agenda" : "Edit Agenda"} />

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
                            onFinish={onFinish}
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
                                    name="status_agenda"
                                    label="Status Agenda"
                                    rules={[{ required: true }]}
                                    style={{ width: "50%" }}
                                >
                                    <Select
                                        placeholder="Pilih Status"
                                        size="large"
                                        value={statusValue}
                                        onChange={(value) =>
                                            setStatusValue(value)
                                        }
                                        options={items2.map((item) => ({
                                            label: item.label,
                                            value: item.label, // Use label as the value
                                        }))}
                                    />
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
                                        style={{
                                            width: "100%",
                                        }}
                                        options={PUBLISH_OPTIONS.map(
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
        </>
    );
}
