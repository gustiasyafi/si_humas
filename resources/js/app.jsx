import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { ConfigProvider } from "antd";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx");

        const exactPath = `./Pages/${name}.jsx`;
        if (pages[exactPath]) {
            return resolvePageComponent(exactPath, pages);
        }

        const indexPath = `./Pages/${name}/Index.jsx`;
        if (pages[indexPath]) {
            return resolvePageComponent(indexPath, pages);
        }

        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#4897FE",
                        borderRadius: 6,
                        colorPrimaryBg: "#4897FE",
                    },
                    components: {
                        Menu: {
                            itemHeight: 45,
                            itemHoverColor: "#fff",
                            itemSelectedColor: "#fff",
                            subMenuItemSelectedColor: "#fff",
                            itemBg: "#2A2A75",
                            itemColor: "#fff",
                        },
                    },
                }}
            >
                <App {...props} />
            </ConfigProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
