import DashboardLayout from "@/Layouts/DashboardLayout";
import FormBerita from "./Form";

export default function EditBerita({ agendaList=[],berita = null }) {
    return (
        <DashboardLayout>
            <FormBerita agendaList={agendaList} berita={berita} type="edit" />
        </DashboardLayout>
    );
}
