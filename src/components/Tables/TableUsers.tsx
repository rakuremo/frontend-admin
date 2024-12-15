import React, { useEffect, useState } from "react";
import { getUsers, searchUser } from "@/api/index";
import { format, set } from "date-fns";
import ReactPaginate from "react-paginate";
import Loader from "@/components/common/Loader";
import { UserData } from "@/types/users";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { useRouter } from "next/navigation";

interface ApiResponse {
  data: UserData[];
  totalPages: number;
  total: number;
}

const TableUsers: React.FC = () => {
  const [packageData, setPackageData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response: ApiResponse = await getUsers({ limit, page });
      setPackageData(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setLoading(false);
    };
    fetchData();
  }, [limit, page]);

  const handleSetLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setLoading(true);
      const response: ApiResponse = await getUsers({ limit, page });
      setLoading(false);
      setIsSearch(false);
      setPackageData(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    }
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      //console.log("searchQuery", searchQuery);
      const response: ApiResponse = await searchUser(searchQuery);
      //console.log("response", response);
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
    setLoading(true);
    const response: ApiResponse = await getUsers({ limit, page });
    setLoading(false);
    setPackageData(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {!isSearch ? (
          <>
            <span className="mb-4 sm:mb-0">
              View {page * limit - limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} result
            </span>
          </>
        ) : (
          <>
            <span className="mb-4 sm:mb-0">View {total} result</span>
          </>
        )}
        <div className="mb-4 flex items-center space-x-2 sm:mb-0">
          {!isSearch && (
            <>
              <span>View</span>
              <select
                value={limit}
                onChange={(e) => handleSetLimit(e)}
                className="rounded border border-gray-300"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </>
          )}
          <ButtonDefault
            label="Add user"
            link="/users/create"
            customClasses="bg-primary text-white rounded-full px-4 py-2 lg:px-3 xl:px-4"
          />
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
            className="rounded-full bg-blue-500 px-4 py-2 text-white"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="rounded-full bg-gray-500 px-4 py-2 text-white"
          >
            Reset
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
                  Index
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  Username
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                  Full Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Updated At
                </th>
                <th className="min-w-[20px] px-4 py-4 font-medium text-dark dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {packageData.map((packageItem, index) => (
                <tr key={packageItem.id} className="text-center">
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${index === packageData.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">{index + 1}</p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 xl:pl-7.5 ${index === packageData.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="mt-[3px] text-body-sm font-medium">
                      {packageItem.username}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 xl:pl-7.5 ${index === packageData.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="mt-[3px] text-body-sm font-medium">
                      {packageItem.name}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${index === packageData.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">
                      {format(
                        new Date(packageItem.updatedAt),
                        "dd/MM/yyyy HH:mm",
                      )}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 ${index === packageData.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p
                      className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                        packageItem.status === true
                          ? "bg-[#219653]/[0.08] text-[#219653]" // Màu xanh lá cây
                          : "bg-[#D34053]/[0.08] text-[#D34053]" // Màu đỏ
                      }`}
                    >
                      {packageItem.status === true ? "Active" : "Inactive"}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 text-center align-middle dark:border-dark-3 xl:pr-7.5 ${index === packageData.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <div className="flex items-center justify-end space-x-3.5">
                      <ButtonDefault
                        label="View"
                        link={`/users/${packageItem.id}`}
                        customClasses="bg-green text-white rounded-full px-4 py-2 lg:px-3 xl:px-4"
                      />
                    </div>
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
    </div>
  );
};

export default TableUsers;
