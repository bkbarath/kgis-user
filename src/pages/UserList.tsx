import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IconComponent from "../assets/icons/IconComponent";
import { Button, Input, Table } from "../components/atoms";
import { Appbar } from "../components/molecule";
import { UserTableColumn } from "../lib/data/common.field";
import type { UserModel } from "../lib/models/user.model";
import type { AlertType } from "../lib/types/common.type";
import userService from "../services/user.api";
import Alert from "../components/atoms/Alert";

// initial alert value
const initialAlert: AlertType = {
  open: false,
  message: "",
  status: "success",
};

const UserList = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [search, setSearch] = useState<string>("");
  const [alert, setAlert] = useState<AlertType>(initialAlert); // state to handle alert popup open

  const fetchUser = async () => {
    try {
      await userService
        .getUsers()
        .then(setUsers)
        .catch(() => setUsers([]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmDelete) return;

      await userService.deleteUser(id).then(() => {
        setAlert({
          message: `User Deleted Successfully`,
          status: "success",
          open: true,
        });
      });

      fetchUser();
    } catch {
      setAlert({
        message: `Failed to delete user. Please try again.`,
        status: "danger",
        open: true,
      });
    }
  };

  const mappedRow = (users ?? [])
    .map((user, index) => ({
      ...user,
      id: index + 1,
      languages:
        user?.languages && user?.languages?.length > 2
          ? `${user.languages?.length} Languages `
          : user.languages?.join(" | "),
      userId: (
        <div className="flex items-center justify-center gap-2">
          {user.photo?.url ? (
            <img src={user.photo?.url} className="w-10 h-10 rounded" />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <IconComponent iconName="cancel" />
            </div>
          )}
          <p>{user.userId}</p>
        </div>
      ),
      moreInfo: (
        <div className="flex w-full justify-center items-center gap-1">
          <Link to={`/user/edit/${user.id}`} replace>
            <IconComponent iconName={"edit"} className="text-info-foreground" />
          </Link>
          <IconComponent
            iconName={"delete"}
            onClick={() => handleDeleteUser(user.id ?? "")}
            className="text-danger-foreground cursor-pointer"
          />
        </div>
      ),
    }))
    .filter(
      (item) =>
        search === "" ||
        item.age?.toString().includes(search) ||
        item.dob.includes(search) ||
        item.username.toLowerCase().includes(search.toLowerCase()) ||
        item.userId.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.gender.toLowerCase().includes(search.toLowerCase())
    );
  return (
    <div className="flex flex-col items-center justify-start bg-light-grey-background min-h-screen">
      {/* Appbar */}
      <Appbar />
      {/* Alert Popup */}
      <Alert
        message={alert.message}
        onClose={() => {
          setAlert(initialAlert);
        }}
        open={alert.open}
        status={alert.status}
      />

      {/* List container */}
      <div className="p-6 w-full flex flex-col md:w-9/10 m-auto h-full space-y-2">
        {/* Filter Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Link to={`/user/add`} className="h-full w-full">
            <Button className="!w-fit">
              <IconComponent iconName={"add"} />
              Create User
            </Button>
          </Link>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table container */}
        <div className="flex  overflow-auto">
          <Table row={mappedRow ?? []} columns={UserTableColumn} />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default UserList;
