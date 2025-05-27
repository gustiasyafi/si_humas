import { Table } from "antd";

/**
 * @param {import("antd").TableProps<any> & { data: any[], columns: any[] }} props
 */
export default function DataTable({ ...props }) {
    return (
        <Table
            className="border border-gray-200 shadow-sm rounded-md"
            scroll={{ x: "max-content" }}
            {...props}
        />
    );
}
