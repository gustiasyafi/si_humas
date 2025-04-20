import {
    PopiconsChevronBottomDuotone,
    PopiconsEditPencilLine,
    PopiconsLockLine,
    PopiconsLogoutSolid,
    PopiconsUserLine,
} from "@popicons/react";
import {
    Avatar,
    Button,
    Divider,
    Dropdown,
    Layout,
    Menu,
    Typography,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { router, usePage } from "@inertiajs/react";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar({ collapsed, setCollapsed }) {
    const user = usePage().props.auth.user;
    const handleEditProfile = () => {
        console.log("Edit profile clicked");
        // Logika edit profile
    };

    const handleChangePassword = () => {
        console.log("Change password clicked");
        // Logika change password
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        // Logika
        router.post("/logout");
    };
    return (
        <Header
            className="top-0 sticky z-50 px-3 py-9"
            style={{
                position: 'sticky',
                width: '100%',
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #E9E9E9",
            }}
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <div className="items-center">
                        <Button
                            type="link"
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {collapsed ? (
                                <MenuUnfoldOutlined className="text-2xl text-gray-800 hover:text-black" />
                            ) : (
                                <MenuFoldOutlined className="text-2xl text-gray-800 hover:text-black" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center mr-4">
                    <Dropdown
                        trigger={["click"]}
                        dropdownRender={() => (
                            <div className="bg-white rounded-md shadow-lg py-1 min-w-[240px]">
                                {/* Profile info section */}
                                <div className="flex items-center p-4">
                                    <Avatar
                                        // src={
                                        //     profilePicture
                                        //         ? `${API_URL}/${profilePicture}`
                                        //         : null
                                        // }
                                        icon={<UserOutlined />}
                                        size={48}
                                    />
                                    <div className="ml-3">
                                        <div className="font-bold">
                                            {user.name}
                                        </div>
                                        <div className="text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <Divider className="my-2" />

                                {/* Menu items */}
                                <Menu selectable={false}>
                                    <Menu.Item
                                        key="edit-profile"
                                        onClick={handleEditProfile}
                                    >
                                        <div className="flex items-center">
                                            <PopiconsEditPencilLine className="size-5 mr-2" />
                                            Edit Profile
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item
                                        key="change-password"
                                        onClick={handleChangePassword}
                                    >
                                        <div className="flex items-center">
                                            <PopiconsLockLine className="size-5 mr-2" />
                                            Change Password
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item
                                        key="logout"
                                        onClick={handleLogout}
                                    >
                                        <div className="flex items-center">
                                            <PopiconsLogoutSolid className="size-5 mr-2" />
                                            Logout
                                        </div>
                                    </Menu.Item>
                                </Menu>
                            </div>
                        )}
                    >
                        <Button
                            className="flex items-center bg-gray-100 hover:bg-gray-200 px-8 py-7 rounded-xl focus:outline-none focus:shadow-outline"
                            shape="round"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Avatar
                                icon={<PopiconsUserLine />}
                                size={36}
                                className="mr-2"
                            />
                            <div className="flex flex-col items-start mr-2">
                                <Text className="font-semibold">
                                    {user.name}
                                </Text>
                                <Text>{user.roles[0].name}</Text>
                            </div>
                            <PopiconsChevronBottomDuotone className="size-5" />
                        </Button>
                    </Dropdown>
                </div>
            </div>
        </Header>
    );
}
