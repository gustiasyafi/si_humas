// import { useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Descriptions, Button } from "antd";
import { PopiconsEditPencilLine } from "@popicons/react";
import dayjs from "dayjs";

export default function Show({ agenda }) {
    const breadcrumbItems = [
        { title: "Beranda", href: "/dashboard" },
        { title: "Agenda", href: "/agenda" },
        { title: "Detail Agenda" },
    ];

    const formattedAgenda = {
        name: agenda.name,
        description: agenda.description,
        date: dayjs(agenda.date).format("DD/MM/YYYY"),
        time: dayjs(agenda.time, "HH:mm").format("HH:mm"),
        location: agenda.location,
        category: agenda.category,
        organizer: agenda.organizer,
        status_agenda: agenda.status_agenda,
        pic: agenda.pic,
        publish: agenda.publish ? agenda.publish.split(",").join(",") : "None",
        status: agenda.status || "Tidak ada",
    };

    const handleEdit = () => {
        router.visit(`/agenda/edit/${agenda.agenda_id}`);
    };

    return (
        <DashboardLayout>
            <Head title="Detail Agenda" />

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="px-6 mb-4 pt-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
                <h1 className="px-6 text-gray-900 font-semibold text-2xl mt-4">
                    Detail Agenda
                </h1>
                <div className="px-6 py-4">
                    <Descriptions
                        bordered
                        column={1}
                        labelStyle={{
                            width: "200px",
                            fontWeight: 500,
                            fontSize: "16px",
                        }}
                    >
                        <Descriptions.Item label="Nama Agenda">
                            {formattedAgenda.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Deskripsi Agenda">
                            {formattedAgenda.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tanggal Agenda">
                            {formattedAgenda.date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Waktu Agenda">
                            {formattedAgenda.time}
                        </Descriptions.Item>
                        <Descriptions.Item label="Lokasi Agenda">
                            {formattedAgenda.location}
                        </Descriptions.Item>
                        <Descriptions.Item label="Kategori Agenda">
                            {formattedAgenda.category}
                        </Descriptions.Item>
                        <Descriptions.Item label="Penanggung Jawab">
                            {formattedAgenda.pic}
                        </Descriptions.Item>
                        <Descriptions.Item label="Penyelenggara">
                            {formattedAgenda.organizer}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status Agenda">
                            {formattedAgenda.status_agenda}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {formattedAgenda.status}
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
