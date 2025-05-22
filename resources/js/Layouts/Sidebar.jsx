import { Link, usePage } from "@inertiajs/react";
import { PopiconsClipboardTextDuotone, PopiconsUsersDuotone, PopiconsHomeMinimalDuotone, PopiconsFolderOpenDuotone } from "@popicons/react";
import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";

const { Sider } = Layout;

function filterMenuByRole(items, role) {
    return items
        .filter((item) => item.allowedRoles.includes(role))
        .map((item) => {
            const newItem = { ...item };
            if (item.children) {
                newItem.children = filterMenuByRole(item.children, role);
            }
            return newItem;
        });
}

export default function Sidebar({ collapsed, setCollapsed }) {
    const { url, props } = usePage();
    const userRole = props.auth.user?.role;
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState(["beranda"]);

    const allMenuItems = [
        {
            key: "beranda",
            icon: <PopiconsHomeMinimalDuotone />,
            label: <Link href="/dashboard">Beranda</Link>,
            allowedRoles: ["superadmin", "admin", "user"],
        },
        {
            key: "master-data",
            icon: <PopiconsClipboardTextDuotone />,
            label: <Link href="/master-data">Master Data</Link>,
            allowedRoles: ["superadmin"],
        },
        {
            key: "konten",
            icon: <PopiconsFolderOpenDuotone />,
            label: "Konten",
            allowedRoles: ["superadmin", "admin", "user"],
            children: [
                {
                    key: "agenda",
                    label: <Link href="/agenda">Agenda</Link>,
                    allowedRoles: ["superadmin", "admin", "user"],
                },
                {
                    key: "berita",
                    label: <Link href="/berita">Berita</Link>,
                    allowedRoles: ["superadmin", "admin", "user"],
                },
            ],
        },
        {
            key: "user-management",
            icon: <PopiconsUsersDuotone />,
            label: <Link href="/user-management">User Management</Link>,
            allowedRoles: ["superadmin"],
        },
    ];

    const filteredMenuItems = filterMenuByRole(allMenuItems, userRole);

    // Update selected keys based on current URL path
    useEffect(() => {
        if (url.startsWith("/dashboard")) {
            setSelectedKeys(["beranda"]);
        } else if (url.startsWith("/master-data")) {
            setSelectedKeys(["master-data"]);
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
            className={`bg-[#ffff]`}
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
                borderRight: "1px solid #e5e7eb", // <-- Border kanan tipis (abu Tailwind: gray-200)
            }}
        >
            <div className="py-4 px-3">
                <h1
                    className={`text-black py-3 font-bold text-center transition-all duration-300 ${
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
                items={filteredMenuItems}
            />
        </Sider>
    );
}
