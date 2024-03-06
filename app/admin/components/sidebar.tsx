/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Dropdown, Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";


const ExampleSidebar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } = {isOpenOnSmallScreens: true}

  const [currentPage, setCurrentPage] = useState("");
  const [isEcommerceOpen, setEcommerceOpen] = useState(true);
  const [isUsersOpen, setUsersOpen] = useState(true);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
    setEcommerceOpen(newPage.includes("/e-commerce/"));
    setUsersOpen(newPage.includes("/users/"));
  }, [setCurrentPage, setEcommerceOpen, setUsersOpen]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        
      >
        <div className="flex flex-col justify-between py-2 h-[100vh] px-5">
          <div>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="/"
                  icon={HiChartPie}
                  className={
                    "/admin" === currentPage ? "bg-gray-100 dark:bg-gray-700 px-5" : "px-5"
                  }
                >
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Collapse
                  icon={HiShoppingBag}
                  label="E-commerce"
                  open={isEcommerceOpen}
                >
                  <Sidebar.Item
                    href="/e-commerce/products"
                    className={
                      "/e-commerce/products" === currentPage
                        ? "bg-gray-100 px-5 dark:bg-gray-700"
                        : "px-5"
                    }
                  >
                    Products
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/e-commerce/billing"
                    className={
                      "/e-commerce/billing" === currentPage
                        ? "bg-gray-100 px-5 dark:bg-gray-700"
                        : "px-5"
                    }
                  >
                    Billing
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/e-commerce/invoice"
                    className={
                      "/e-commerce/invoice" === currentPage
                        ? "bg-gray-100 px-5 dark:bg-gray-700"
                        : "px-5"
                    }
                  >
                    Invoice
                  </Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Collapse
                  icon={HiUsers}
                  label="Users"
                  open={isUsersOpen}
                >
                  <Sidebar.Item
                    href="/users/list"
                    className={
                      "/users/list" === currentPage
                        ? "bg-gray-100 px-5 dark:bg-gray-700"
                        : "px-5"
                    }
                  >
                    Users list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/profile"
                    className={
                      "/users/profile" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700 px-5"
                        : "px-5"
                    }
                  >
                    Profile
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/feed"
                    className={
                      "/users/feed" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700 px-5"
                        : "px-5"
                    }
                  >
                    Feed
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/settings"
                    className={
                      "/users/settings" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700 px-5"
                        : "px-5"
                    }
                  >
                    Settings
                  </Sidebar.Item>
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};


export default ExampleSidebar;
