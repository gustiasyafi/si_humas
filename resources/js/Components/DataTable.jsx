import { Table } from "antd";

export default function DataTable({ data, columns }) {
    return <Table dataSource={data} columns={columns} scroll={{  x:"max-content" }} />;
}
