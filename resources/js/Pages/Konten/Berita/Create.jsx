import DashboardLayout from "@/Layouts/DashboardLayout";
import FormBerita from "./Form";

export default function CreateBerita({agendaList = []}) {
    return (
        <DashboardLayout>
            <FormBerita agendaList={agendaList} type="create" />
        </DashboardLayout>
    );
}
