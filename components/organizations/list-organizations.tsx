import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import AdminEditOrganization from "./edit-organizations";
import AdminOrganizationsDelete from "./delete-organizations";

const ListOrganizations = ({ orgData }) => {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const router = useRouter();
  const handlePaginate = (page: any) => {
    const path = router.pathname;
    const query = router.query;
    query.page = page.selected + 1;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };

  const handleDelete = (Delete: any) => {
    setShowDeleteModal((prev) => !prev);
    setDeleteList(Delete);
  };

  return (
    <>
      <div className="px-1 sm:px-2 lg:px-4">
        <div className="mt-5 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-3xl">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Insurer Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Region
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        City
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Mobile Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Updated At
                      </th>
                      {session?.user?.memberships?.role === "SUPERADMIN" && (
                        <th
                          scope="col"
                          className="relative py-3.5 pl-1 pr-1 sm:pr-3"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      )}
                      {session?.user?.memberships?.role === "SUPERADMIN" && (
                        <th
                          scope="col"
                          className="relative py-3.5 pl-1 pr-1 sm:pr-3"
                        >
                          <span className="sr-only">Delete</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orgData?.organizations?.length > 0 &&
                      orgData?.organizations?.map((item: any, i: any) => (
                        <tr key={i}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {i + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.orgName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.region}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.city}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.mobileNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.createdAt), "MMM-dd-yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.updatedAt), "MMM-dd-yyyy")}
                          </td>
                          {session?.user?.memberships?.role ===
                            "SUPERADMIN" && (
                            <td className="relative whitespace-nowrap py-4 pl-1 text-right text-sm font-medium sm:pr-6">
                              <>
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  data-tip
                                  data-type="warning"
                                  data-for="editInsurer"
                                >
                                  <AiFillEdit
                                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </button>
                                <ReactTooltip
                                  id="editInsurer"
                                  place="top"
                                  effect="solid"
                                >
                                  Edit Insurer
                                </ReactTooltip>
                              </>
                            </td>
                          )}
                          {session?.user?.memberships?.role ===
                            "SUPERADMIN" && (
                            <td className="relative whitespace-nowrap py-4 pl-1 text-right text-sm font-medium sm:pr-6">
                              <>
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  data-tip
                                  data-type="error"
                                  data-for="deleteInsurer"
                                >
                                  <AiFillDelete
                                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </button>
                                <ReactTooltip
                                  id="deleteInsurer"
                                  place="top"
                                  effect="solid"
                                >
                                  Delete Insurer
                                </ReactTooltip>
                              </>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex align-middle py-1 md:px-6 lg:px-8 flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            {orgData?.organizations.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={orgData.curPage - 1}
                pageCount={orgData.maxPage}
                onPageChange={handlePaginate}
                containerClassName={
                  "border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-6"
                }
                pageClassName={
                  "border-transparent text-gray-700 hover:text-gray-900 hover:border-black border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                }
                previousLinkClassName={
                  "relative inline-flex mt-2 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                nextLinkClassName={
                  "relative inline-flex mt-2 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                activeClassName={
                  "border-t-2 border-lightBlue text-deepGreen font-semibold"
                }
              />
            )}
          </div>
        </div>
      </div>
      {showEditModal ? (
        <AdminEditOrganization organizations={editList} />
      ) : null}
      {showDeleteModal ? (
        <AdminOrganizationsDelete organizations={deleteList} />
      ) : null}
    </>
  );
};

export default ListOrganizations;
