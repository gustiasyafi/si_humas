import { router, usePage } from "@inertiajs/react";
import {
    PopiconsClipboardTextDuotone,
    PopiconsUsersDuotone,
    PopiconsHomeMinimalDuotone,
    PopiconsFolderOpenDuotone,
} from "@popicons/react";
import { Layout, Menu } from "antd";
import { useState, useEffect, useMemo } from "react";

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

    const allMenuItems = useMemo(
        () => [
            {
                key: "beranda",
                icon: <PopiconsHomeMinimalDuotone />,
                label: "Beranda",
                allowedRoles: ["superadmin", "admin", "user"],
                path: "/dashboard",
            },
            {
                key: "konten",
                icon: <PopiconsFolderOpenDuotone />,
                label: "Konten",
                allowedRoles: ["superadmin", "admin", "user"],
                children: [
                    {
                        key: "agenda",
                        label: "Agenda",
                        allowedRoles: ["superadmin", "admin", "user"],
                        path: "/agenda",
                    },
                    {
                        key: "berita",
                        label: "Berita",
                        allowedRoles: ["superadmin", "admin", "user"],
                        path: "/berita",
                    },
                ],
            },
            {
                key: "unit-kerja",
                icon: <PopiconsClipboardTextDuotone />,
                label: "Master Data",
                allowedRoles: ["superadmin"],
                children: [
                    {
                        key: "unit-kerja",
                        label: "Unit Kerja",
                        allowedRoles: ["superadmin"],
                        path: "/unit-kerja",
                    },
                ],
            },
            {
                key: "user-management",
                icon: <PopiconsUsersDuotone />,
                label: "User Management",
                allowedRoles: ["superadmin"],
                path: "/user-management",
            },
        ],
        [],
    );

    const filteredMenuItems = filterMenuByRole(allMenuItems, userRole);

    function findMenuKeyByPath(items, path) {
        for (const item of items) {
            if (item.path && path.startsWith(item.path)) {
                return { selectedKey: item.key, openKey: null };
            }
            if (item.children) {
                for (const child of item.children) {
                    if (child.path && path.startsWith(child.path)) {
                        return { selectedKey: child.key, openKey: item.key };
                    }
                }
            }
        }
        return { selectedKey: null, openKey: null };
    }

    useEffect(() => {
        const { selectedKey, openKey } = findMenuKeyByPath(allMenuItems, url);
        if (selectedKey) setSelectedKeys([selectedKey]);
        if (openKey && !collapsed) setOpenKeys([openKey]);
    }, [url, collapsed, allMenuItems]);

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
                    className={`text-[#4392F8] py-3 font-bold text-center transition-all duration-300 ${
                        collapsed ? "text-xs" : "text-2xl"
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
                onClick={({ key }) => {
                    const target = filteredMenuItems
                        .flatMap((menu) => menu.children || [menu])
                        .find((menu) => menu.key === key);
                    if (target?.path) {
                        router.visit(target.path);
                    }
                }}
                items={filteredMenuItems}
            />
        </Sider>
    );
}
