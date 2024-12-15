"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TableHardwaresUser from "@/components/Tables/TableHardwaresUser";
import { useParams } from "next/navigation";
import { HardwareData } from "@/types/hardwares";
import { UserData } from "@/types/users";
import { getHardwaresWithUser,banUser } from "@/api/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ApiResponse {
  user_hardware: HardwareData[];
  data: UserData;
}
const DetailUser: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const userId = Number(id);
  const [packageData, setPackageData] = useState<UserData>({
    id: 0,
    name: "",
    username: "",
    role: "",
    status: false,
    createdAt: "",
    updatedAt: "",
  });


  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const response: ApiResponse = await getHardwaresWithUser(userId);
      setPackageData(response.data);
      //console.log("userx", response.data);
    };
    fetchData();
  }, [userId,showModal]);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = async () => {
    try {
      const data = {userId,status: !packageData.status }
      const res = await banUser(data)
      toast.success("Update status successfully");
    } catch (error) {
      //console.log("error:",error);
      toast.error("Update status failed");
    }
    setShowModal(false);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" subPageName="DetailUser" />
      <ToastContainer />
      <>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                <h3 className="font-medium text-dark dark:text-white">
                  User Information
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder={packageData.name}
                    disabled
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder={packageData.username}
                    disabled
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Role
                  </label>
                  <input
                    type="text"
                    placeholder={packageData.role}
                    disabled
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Status
                  </label>
                  <input
                    type="text"
                    placeholder={packageData.status ? "Active" : "Block"}
                    disabled
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark"
                  />
                </div>
                <button
                  onClick={openModal}
                  className={`flex justify-center rounded-[7px] px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 ${
                    packageData.status ? "bg-red" : "bg-green"
                  }`}
                >
                  {packageData.status ? "Block Account" : "Unblock Account"}
                </button>
              </div>
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="rounded bg-white p-8 shadow-md">
                <h2 className="mb-4 text-xl font-bold">Confirm!</h2>
                <p className="mb-4">
                Are you sure you want to {packageData.status ? "block" : "unblock"}{" "}
                this user?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChange}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="col-span-5 xl:col-span-3">
            <TableHardwaresUser userId={userId} />
          </div>
        </div>
      </>
    </DefaultLayout>
  );
};

export default DetailUser;
