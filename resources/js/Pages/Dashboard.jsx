import DataTable from "@/Components/DataTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

export default function Dashboard({
    auth,
    berita,
    agenda,
    user,
    pending,
    recentlyAdded,
    monthlyStats,
    pieChartData,
}) {
    const categoryData = [
        { name: "Mahasiswa UNS", value: 65 },
        { name: "Kerja Sama UNS", value: 35 },
        { name: "Produk dan Penelitian", value: 24 },
        { name: "Pengabdian", value: 10 },
        { name: "Lainnya", value: 20 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    console.log("Berita Data:", berita);
    console.log("Agenda Data:", agenda);
    console.log("Jumlah User:", user);
    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Selamat Datang, {auth?.user?.name || "Admin"}!
                </h1>
                <p className="mt-2 text-gray-600">
                    Berikut adalah ringkasan aktivitas website HUMAS UNS.
                </p>
            </div>

            {/* Stats Cards */}
            <div
                className={`grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2 ${auth.user.role === "superadmin" ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
            >
                {/* Card 1 */}
                <div className="p-5 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Menunggu Persetujuan
                            </p>
                            <p className="text-2xl font-semibold text-gray-700">
                                {pending?.total}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p className="flex items-center text-sm text-yellow-500">
                        <span>
                            *{pending?.agenda} agenda dan {pending?.berita}{" "}
                            berita
                        </span>
                        {/* <span className="ml-1">menunggu persetujuan</span> */}
                    </p>
                    {/* <p className="flex items-center text-sm text-yellow-500">
                        <span>3 berita </span>
                        <span className="ml-1">menunggu persetujuan</span>
                    </p> */}
                </div>

                {/* Card 2 */}
                <div className="p-5 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Berita
                            </p>
                            <p className="text-2xl font-semibold text-gray-700">
                                {berita?.total}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p
                        className={`flex items-center text-sm ${berita?.perubahan_mingguan.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                        <span>{berita?.perubahan_mingguan}</span>
                        <span className="ml-1">dari minggu lalu</span>
                    </p>
                </div>

                {/* Card 3 */}
                <div className="p-5 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Agenda
                            </p>
                            <p className="text-2xl font-semibold text-gray-700">
                                {agenda?.total}
                            </p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p
                        className={`flex items-center text-sm ${agenda?.perubahan_mingguan.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                        <span>{agenda?.perubahan_mingguan}</span>
                        <span className="ml-1">dari minggu lalu</span>
                    </p>
                </div>

                {/* Card 4 */}
                {auth.user.role === "superadmin" && (
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Pengguna
                                </p>
                                <p className="text-2xl font-semibold text-gray-700">
                                    {user?.total}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <p
                            className={`flex items-center text-sm ${user?.perubahan_mingguan.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                        >
                            <span>{user?.perubahan_mingguan}</span>
                            <span className="ml-1">dari minggu lalu</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
                {/* Line Chart */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Statistik Agenda dan Berita
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Agenda"
                                    stroke="#2A2A75"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Berita"
                                    stroke="#82ca9d"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Konten Berdasarkan Kategori
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#2A2A75" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            {/* Recently Card */}
            <div className=" mt-8">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Baru Saja Ditambahkan
                    </h2>
                    <div className="h-80">
                        <DataTable
                            dataSource={recentlyAdded}
                            columns={[
                                {
                                    title: "Konten",
                                    dataIndex: "type",
                                    key: "type",
                                },
                                {
                                    title: "Judul",
                                    dataIndex: "title",
                                    key: "title",
                                    sorter: (a, b) =>
                                        a.title.localeCompare(b.title),
                                },
                                {
                                    title: "Tanggal",
                                    dataIndex: "created_at",
                                    key: "created_at",
                                    render: (text) => {
                                        const date = new Date(text);

                                        // Format jam dan menit
                                        const timeFormatter =
                                            new Intl.DateTimeFormat("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false, // Gunakan format 24 jam
                                            });

                                        // Format tanggal
                                        const dateFormatter =
                                            new Intl.DateTimeFormat("id-ID", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            });

                                        // Gabungkan dalam format jam - tanggal
                                        return `${timeFormatter.format(date)} - ${dateFormatter.format(date)}`;
                                    },
                                },
                                {
                                    title: "Unit Kerja",
                                    dataIndex: "unit_kerja",
                                    key: "unit_kerja",
                                    render: (unit_kerja) => unit_kerja ?? "-",
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
