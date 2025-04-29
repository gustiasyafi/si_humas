import { Table } from "antd";

/**
 * @param {import("antd").TableProps<any> & { data: any[], columns: any[] }} props
 */
export default function DataTable({ ...props }) {
    return <Table scroll={{ x: "max-content" }} {...props} />;
}
