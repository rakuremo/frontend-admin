import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { UserDataHardware } from "@/types/users";
import { useRouter } from "next/navigation";
import { DeleteUsers } from "@/types/deleteUsers";
import { getUsersWithHardware, deleteUser } from "@/api/index";
import { AddHardwareData } from "@/types/hardwares";
import TableAddUsers from "./TableAddUsers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

interface ApiResponse {
  user_hardware: UserDataHardware[];
  data: AddHardwareData[];
}

interface TableUserHardwareProps {
  hardwareId: number;
}

const TableUserHardware: React.FC<TableUserHardwareProps> = ({ hardwareId }) => {
  const [packageData, setPackageData] = useState<UserDataHardware[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const response: ApiResponse = await getUsersWithHardware(hardwareId);
    setPackageData(response.user_hardware);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [hardwareId, showTableModal]);

  const handleDeleteUsers = async () => {
    const deleteData: DeleteUsers = {
      users: selectedUsers.map((id) => ({ user_id: id })),
    };
    setButtonLoading(true);
    try {
      await deleteUser(hardwareId, deleteData);
      toast.success("Delete user successfully");
    } catch (error) {
      toast.error("Delete user failed");
    } finally {
      setButtonLoading(false);
      fetchData();
      setShowModal(false);
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openTableModal = () => {
    setShowTableModal(true);
  };

  const closeTableModal = () => {
    setShowTableModal(false);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* <ToastContainer /> */}
      <div className="mt-4 flex items-center justify-between">
        <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
          List of users
        </h4>
        <span>View {packageData.length} result</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={openTableModal}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
          >
            Add
          </button>
          <button
            onClick={openModal}
            className="flex justify-center rounded-[7px] bg-red-500 px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] text-center dark:bg-dark-2">
                <th className="min-w-[10px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedUsers(
                        e.target.checked
                          ? packageData.map((item) => item.user_id)
                          : [],
                      )
                    }
                    checked={selectedUsers.length === packageData.length}
                  />
                </th>
                <th className="min-w-[10px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  Index
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  Full Name
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  Username
                </th>
                <th className="min-w-[20px] px-4 py-4 font-medium text-dark dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {packageData.map((packageItem, index) => (
                <tr key={packageItem.user_id} className="text-center">
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${
                      index === packageData.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(packageItem.user_id)}
                      onChange={() => toggleSelectUser(packageItem.user_id)}
                    />
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${
                      index === packageData.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }`}
                  >
                    <p className="text-dark dark:text-white">{index + 1}</p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 xl:pl-7.5 ${
                      index === packageData.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }`}
                  >
                    <p className="mt-[3px] text-body-sm font-medium">
                      {packageItem.name}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 xl:pl-7.5 ${
                      index === packageData.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }`}
                  >
                    <p className="mt-[3px] text-body-sm font-medium">
                      {packageItem.username}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${
                      index === packageData.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }`}
                  >
                    <p
                      className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                        packageItem.status === true
                          ? "bg-[#219653]/[0.08] text-[#219653]"
                          : "bg-[#D34053]/[0.08] text-[#D34053]"
                      }`}
                    >
                      {packageItem.status === true ? "Active" : "Inactive"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-8 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Confirm deletion!</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa các user đã chọn không?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUsers}
                className={`flex items-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${buttonLoading ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={buttonLoading}
              >
                {buttonLoading ? (
                  <ClipLoader size={20} color={"#fff"} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-3/4 w-3/4 overflow-auto rounded bg-white p-8 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Add Hardware</h2>
            <TableAddUsers hardwareId={hardwareId} />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeTableModal}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableUserHardware;
