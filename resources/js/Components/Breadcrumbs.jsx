import { Breadcrumb } from "antd";
import { Link } from "@inertiajs/react";

const Breadcrumbs = ({ items }) => {
    return (
      <Breadcrumb className="mb-4">
        {items.map((item, index) => (
          <Breadcrumb.Item key={index}>
            {item.href ? (
              <Link href={item.href}>{item.title}</Link>
            ) : (
              <span>{item.title}</span>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };
  
  export default Breadcrumbs;