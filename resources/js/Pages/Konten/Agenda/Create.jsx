import DashboardLayout from "@/Layouts/DashboardLayout";
import FormAgenda from "./Form";

export default function Agenda() {
    return (
        <DashboardLayout>
            <FormAgenda type="create" />
        </DashboardLayout>
    );
}
