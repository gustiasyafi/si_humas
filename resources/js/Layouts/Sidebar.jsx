import { Link, usePage } from "@inertiajs/react";
import {
    PopiconsFolderOpenLine,
    PopiconsHomeMinimalLine,
    PopiconsUsersLine,
} from "@popicons/react";
import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
    const { url } = usePage();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState(["konten"]);

    // Update selected keys based on current URL path
    useEffect(() => {
        if (url.startsWith("/dashboard")) {
            setSelectedKeys(["beranda"]);
        } else if (url.startsWith("/agenda")) {
            setSelectedKeys(["agenda"]);
            if (!collapsed) setOpenKeys(["konten"]);
        } else if (url.startsWith("/berita")) {
            setSelectedKeys(["berita"]);
            if (!collapsed) setOpenKeys(["konten"]);
        } else if (url.startsWith("/user-management")) {
            setSelectedKeys(["user-management"]);
        }
    }, [url, collapsed]);

    return (
        <Sider
            className={`bg-[#2A2A75] transition-all duration-300 shadow-lg`}
            trigger={null}
            collapsible
            collapsed={collapsed || window.innerWidth < 768}
            width={window.innerWidth < 1024 ? 200 : 250}
            collapsedWidth={window.innerWidth < 640 ? 0 : 70}
            breakpoint="lg"
            onBreakpoint={(broken) => {
                if (broken) {
                    setCollapsed(true);
                }
            }}
            style={{
                position: "sticky",
                top: 0,
                height: "100vh", // Gunakan viewport height
                zIndex: 10, // Pastikan muncul di atas konten lain
                overflow: "auto",
            }}
        >
            <div className="py-4 px-3">
                <h1
                    className={`text-white py-3 font-bold text-center transition-all duration-300 ${
                        collapsed ? "text-xs" : "text-xl"
                    }`}
                >
                    {collapsed ? "HUMAS" : "HUMAS UNS"}
                </h1>
            </div>
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={!collapsed ? openKeys : []}
                onOpenChange={setOpenKeys}
                // onClick={handleMenuClick}
                items={[
                    {
                        key: "beranda",
                        icon: <PopiconsHomeMinimalLine />,
                        label: <Link href="/dashboard">Beranda</Link>,
                    },
                    {
                        key: "konten",
                        icon: <PopiconsFolderOpenLine />,
                        label: "Konten",
                        children: [
                            {
                                key: "agenda",
                                label: <Link href="/agenda">Agenda</Link>,
                            },
                            {
                                key: "berita",
                                label: <Link href="/berita">Berita</Link>,
                            },
                        ],
                    },
                    {
                        key: "user-management",
                        icon: <PopiconsUsersLine />,
                        label: (
                            <Link href="/user-management">User Management</Link>
                        ),
                    },
                ]}
            />
        </Sider>
    );
}
