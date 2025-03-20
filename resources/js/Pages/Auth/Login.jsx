import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button, Input } from "antd";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-xl">
                <Head title="Login" />

                <div className="w-full max-w-md mx-auto">
                    {/* Card header with login title */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-800">
                            LOGIN
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Login untuk Masuk ke Sistem Humas UNS
                        </p>
                    </div>

                    {/* Card with shadow and rounded corners */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 p-4 bg-green-50 rounded-md">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="font-semibold text-gray-700"
                            />

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

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="rounded text-blue-600"
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="mt-6 flex items-start">
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>
                        <div className="flex mt-6 justify-center">
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                className="px-6 py-2  text-white rounded-md transition-colors duration-300"
                                disabled={processing}
                            >
                                Log in
                            </Button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>Created by TIK UNS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
