// import { useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Descriptions, Button, List, Avatar } from "antd";
import { PopiconsEditPencilLine, PopiconsFileDuotone } from "@popicons/react";
import dayjs from "dayjs";

export default function Show({ berita }) {
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Berita", href: "/berita" },
        { title: "Detail Berita" },
    ];

    console.log(berita);

    const formattedBerita = {
        agenda: berita.agenda?.name || "-",
        title: berita.title,
        description: berita.description,
        date: dayjs(berita.date).format("DD/MM/YYYY"),
        category: berita.category,
        link: berita.link || null,
        priority: berita.priority,
        publish: berita.publish ? berita.publish.split(",").join(",") : "None",
        status: berita.status || "Tidak ada",
        files: berita.files || [],
    };

    const handleEdit = () => {
        router.visit(`/berita/edit/${berita.id}`);
    };

    return (
        <DashboardLayout>
            <Head title="Detail Berita" />

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="px-6 mb-4 pt-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
                <h1 className="px-6 text-gray-900 font-semibold text-2xl mt-4">
                    Detail Berita
                </h1>
                <div className="px-6 py-4">
                    <Descriptions
                        bordered
                        title="Detail Berita"
                        column={1}
                        labelStyle={{
                            width: "200px",
                            fontWeight: 500,
                            fontSize: "16px",
                        }}
                    >
                        <Descriptions.Item label="Nama Agenda">
                            {formattedBerita.agenda}
                        </Descriptions.Item>
                        <Descriptions.Item label="Judul Berita">
                            {formattedBerita.title}
                        </Descriptions.Item>
                        <Descriptions.Item label="Isi Berita atau Press Release">
                        <div dangerouslySetInnerHTML={{ __html: formattedBerita.description }} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Tanggal Agenda">
                            {formattedBerita.date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Kategori Berita">
                            {formattedBerita.category}
                        </Descriptions.Item>
                        <Descriptions.Item label="Link Berita ">
                            {formattedBerita.link ? (
                                <a
                                    href={formattedBerita.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {formattedBerita.link}
                                </a>
                            ) : (
                                "Tidak ada link"
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Prioritas Berita">
                            {formattedBerita.priority}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="File atau Gambar">
                            {formattedAgenda.status_agenda}
                        </Descriptions.Item> */}
                        <Descriptions.Item label="Media Publikasi">
                            {formattedBerita.publish}
                        </Descriptions.Item>
                        <Descriptions.Item label="File Upload">
                            <List
                                size="small"
                                dataSource={formattedBerita.files}
                                renderItem={(file) => {
                                    const isImage =
                                        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                                            file.file_name,
                                        );
                                    const fileUrl = `/storage/${file.file_path}`;

                                    return (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    isImage ? (
                                                        <Avatar
                                                            shape="square"
                                                            size={48}
                                                            src={fileUrl}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            shape="square"
                                                            size={48}
                                                            icon={
                                                                <PopiconsFileDuotone />
                                                            }
                                                        />
                                                    )
                                                }
                                                title={
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {file.file_name}
                                                    </a>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Status Berita">
                            {formattedBerita.status}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="px-6 py-4">
                    <Button
                        type="primary"
                        size="large"
                        icon={<PopiconsEditPencilLine />}
                        onClick={handleEdit}
                    >
                        Edit Data
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
