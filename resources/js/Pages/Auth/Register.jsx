import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button, Input } from "antd";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        // Pastikan konfirmasi password dan password cocok sebelum submit
        if (data.password !== data.password_confirmation) {
            alert("Password dan konfirmasi password tidak cocok");
            return;
        }

        post(route("register"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 ">
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-lg sm:rounded-xl">
                <Head title="Register" />

                <div className="w-full max-w-md mx-auto">
                    {/* Card header with login title */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-800">
                            REGISTER
                        </h1>
                    </div>
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 p-4 bg-green-50 rounded-md">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nama Lengkap"
                                className="font-semibold text-gray-700"
                            />

                            <Input
                                size="large"
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="name"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Masukkan nama anda"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-6">
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="font-semibold text-gray-700"/>
                            <Input
                                size="large"
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="Masukkan email anda"
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-6">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="font-semibold text-gray-700"
                            />

                            <Input
                                size="large"
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="Masukkan password anda"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-6">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Konfirmasi Password"
                                className="font-semibold text-gray-700"
                            />

                            <Input
                                size="large"
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full rounded-md"
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                placeholder="Konfirmasi password anda"
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex mt-6 justify-center">
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                className="px-6 py-2  text-white rounded-md transition-colors duration-300"
                                disabled={processing}
                            >
                                Register
                            </Button>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                >
                                    Klik disini
                                </Link>
                            </p>
                        </div>
                        
                    </form>
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>Created by TIK UNS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

