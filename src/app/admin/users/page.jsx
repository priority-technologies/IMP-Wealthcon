"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import UserUploader from "../../../components/Modal/UserUploader";
import UploadIcon from "../../../assets/images/svg/addIcon.svg";
import TrashIcon from "../../../assets/images/svg/trashIcon.svg";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";
import Select from "../../../components/Input/Select";
import Table from "../../../components/Table";
import axios from "axios";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { debounce } from "@/helpers/all";
import Input from "@/components/Input";

const Filter = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);

  let cancelToken;

  const handleFilterChange = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const handleProcessSelected = () => {
    if (selectedUsers.length > 0) {
      const confirmed = window.confirm(
        "Are you sure you want to delete the selected users?"
      );

      if (confirmed) {
        setLoading(true);
        axios
          .delete(`/api/admin/users/${selectedUsers[0]}`, {
            data: { userIds: selectedUsers },
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            if (res.status === 200) {
              alert("Users deleted successfully");
              const updatedTableData = tableData.filter(
                (user) => !selectedUsers.includes(user._id)
              );
              setTableData(updatedTableData);
              setFilteredData(updatedTableData);
              setSelectedUsers([]);
            }
          })
          .catch((error) => {
            if (error?.response?.status === 401) {
              return router.push("/login");
            }
            console.error("Error deleting users:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const fetchUsers = async (page, role, searchTerm) => {
    setLoading(true);

    if (cancelToken) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = axios.CancelToken.source();

    try {
      const params = {
        category: role === "all" ? null : role,
        page,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const res = await axios.get("/api/admin/users", {
        params,
        cancelToken: cancelToken?.token,
      });

      if (res.status === 200) {
        setTableData(res.data);
        setFilteredData(res.data);
        setCurrentPage(Number(res.headers["x-current-page"]));
        setTotalPages(Number(res.headers["x-total-pages"]));
        setTotalItem(Number(res.headers["x-total-item"]));
      }
      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else if (error?.response?.status === 401) {
        return router.push("/login");
      } else {
        console.error("Error fetching users:", error);
      }
    } finally {
    }
  };

  // Create a debounced version of fetchUsers
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  // Fetch users when pagination or filter changes
  useEffect(() => {
    debouncedFetchUsers(currentPage, selectedRole, searchTerm);
  }, [currentPage, selectedRole, searchTerm, debouncedFetchUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Fragment>
      <div className="flex justify-between items-center flex-wrap mb-5 gap-3">
        <Typography
          tag="h1"
          size="text-xl"
          weight="font-semibold"
          color="text-base-content"
          className="block text-left"
        >
          User Management
        </Typography>
        <div className="user-search filter-wrapper flex justify-start items-center flex-wrap gap-2">
          {/* Search bar */}
          <Input
            type="text"
            placeholder="Search by full name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2"
          />

          <Button
            icon={TrashIcon}
            iconPosition="left"
            className="bg-red-600 border-red-600 btn-sm"
            onClick={handleProcessSelected}
            disabled={selectedUsers.length === 0}
          >
            <span className="md:block hidden">Delete</span>
          </Button>
          <Button
            icon={UploadIcon}
            iconPosition="left"
            className="btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            <span className="md:block hidden">Add User</span>
          </Button>
          <UserUploader
            fetchUsers={fetchUsers}
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <Select
            value={selectedRole}
            onChange={handleFilterChange}
            options={[
              { label: "All Category", value: "all" },
              { label: "Lot 1", value: "lot1" },
              { label: "Lot 2", value: "lot2" },
              { label: "Lot 3", value: "lot3" },
              { label: "Lot 4", value: "lot4" },
              { label: "Lot 5", value: "lot5" },
              { label: "Lot 6", value: "lot6" },
              { label: "Lot 7", value: "lot7" },
              { label: "Lot 8", value: "lot8" },
              { label: "Lot 9", value: "lot9" },
              { label: "Lot 10", value: "lot10" },
              { label: "Lot 11", value: "lot11" },
              { label: "Lot 12", value: "lot12" },
              { label: "Lot 13", value: "lot13" },
              { label: "Lot 14", value: "lot14" },
              { label: "Lot 15", value: "lot15" },
            ]}            
            className="border rounded-none w-full p-4 pr-10"
          />
        </div>
      </div>

      <Table
        selectedRole={selectedRole}
        setSelectedUsers={setSelectedUsers}
        loading={loading}
        tableData={filteredData}
        setTableData={setTableData}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItem={totalItem}
        onPageChange={setCurrentPage}
      />
    </Fragment>
  );
};

export default Filter;