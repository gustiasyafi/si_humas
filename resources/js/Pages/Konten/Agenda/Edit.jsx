import DashboardLayout from "@/Layouts/DashboardLayout";
import FormAgenda from "./Form";

export default function EditAgenda({ agenda = null }) {
    return (
        <DashboardLayout>
            <FormAgenda agenda={agenda} type="edit" />
        </DashboardLayout>
    );
}
