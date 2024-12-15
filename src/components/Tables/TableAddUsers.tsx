import React, { useEffect, useState } from "react";
import { getUsersCanAdd, searchUser } from "@/api/index";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import Loader from "@/components/common/Loader";
import { UserData } from "@/types/users";
import { useRouter } from "next/navigation";
import { AddUsers } from "@/types/addUsers";
import { addUserWithHardware } from "@/api/index";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

interface ApiResponse {
  data: UserData[];
  totalPages: number;
  total: number;
}

interface TableAddUsersProps {
  hardwareId: number;
}

const TableAddUsers: React.FC<TableAddUsersProps> = ({ hardwareId }) => {
  const [packageData, setPackageData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const fetchData = async () => {
    setLoading(true);
    const response: ApiResponse = await getUsersCanAdd({
      limit,
      page,
      hardware_id: hardwareId,
    });
    setPackageData(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [limit, page]);

  const handleSetLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  const handleAddUsers = async () => {
    const addData: AddUsers = {
      hardware_id: hardwareId,
      users: selectedUsers.map((id) => ({ user_id: id })),
    };
    setButtonLoading(true);
    try {
      await addUserWithHardware(addData);
      toast.success("Add successful");
    } catch (error) {
      toast.error("Add error");
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

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      const response: ApiResponse = await getUsersCanAdd({
        limit,
        page,
        hardware_id: hardwareId,
      });
      setIsSearch(false);
      setPackageData(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    }
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      const response: ApiResponse = await searchUser(searchQuery);
      setPackageData(response.data);
      setIsSearch(true);
      setTotalPages(1);
      setTotal(response.data.length);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchQuery("");
    setIsSearch(false);
    const response: ApiResponse = await getUsersCanAdd({
      limit,
      page,
      hardware_id: hardwareId,
    });
    setPackageData(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* <ToastContainer /> */}
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        List users
      </h4>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {!isSearch ? (
          <>
            <span className="mb-4 sm:mb-0">
              View {page * limit - limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} result
            </span>
          </>
        ) : (          
        <>
          <span className="mb-4 sm:mb-0">
            View {total} result
          </span>
        </>)}

        <div className="mb-4 flex items-center space-x-2 sm:mb-0">
          {!isSearch && (
            <>
              <span>View </span>
              <select
                value={limit}
                onChange={(e) => handleSetLimit(e)}
                className="rounded border border-gray-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </>
          )}
          <button
            onClick={openModal}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
          >
            Add
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 flex items-center space-x-2 sm:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search username..."
            className="rounded border px-4 py-2"
          />
          <button
            onClick={handleSearchSubmit}
            className={`rounded-full bg-blue-500 px-4 py-2 text-white ${buttonLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <ClipLoader size={20} color={"#fff"} />
            ) : (
              "Search"
            )}
          </button>
          <button
            onClick={handleReset}
            className={`rounded-full bg-gray-500 px-4 py-2 text-white ${buttonLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <ClipLoader size={20} color={"#fff"} />
            ) : (
              "Reset"
            )}
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
                          ? packageData.map((item) => item.id)
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
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Updated At
                </th>
                <th className="min-w-[20px] px-4 py-4 font-medium text-dark dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {packageData.map((packageItem, index) => (
                <tr key={packageItem.id} className="text-center">
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${
                      index === packageData.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(packageItem.id)}
                      onChange={() => toggleSelectUser(packageItem.id)}
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
                    <p className="text-dark dark:text-white">
                      {format(
                        new Date(packageItem.updatedAt),
                        "dd/MM/yyyy HH:mm",
                      )}
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
          {!isSearch && (
            <div className="pagination-container mt-4 flex justify-center">
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex space-x-4"}
                activeClassName={"active bg-blue-500 text-white rounded-full"}
                forcePage={page - 1}
              />
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-8 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Confirm addition!</h2>
            <p className="mb-4">
              Are you sure you want to add the selected users?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUsers}
                className={`flex items-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${buttonLoading ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={buttonLoading}
              >
                {buttonLoading ? (
                  <ClipLoader size={20} color={"#fff"} />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAddUsers;
