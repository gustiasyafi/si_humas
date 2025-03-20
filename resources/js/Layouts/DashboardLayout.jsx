import { useState } from "react";
import Sidebar from "./Sidebar";
import { Layout } from "antd";
import Navbar from "./Navbar";
const { Content } = Layout;

const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout
            hasSider
            style={{
                borderRadius: 4,
            }}
            className="flex min-h-screen bg-gray-100"
        >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout>
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
                {/* Content */}
                <Content className="flex-grow p-6 m-4 bg-white rounded-lg shadow-sm">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
