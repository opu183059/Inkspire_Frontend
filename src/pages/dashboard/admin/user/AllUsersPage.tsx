import { message, Switch, Table } from "antd";
import Loader from "../../../../components/common/Loader";
import {
  useGetAllUserQuery,
  useToggleBlockStatusMutation,
  useToggleDeleteStatusMutation,
} from "../../../../redux/feature/userApi/userApi";
import { ColumnsType } from "antd/es/table";
import { convertDate } from "../../../../utils/convertDate";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const AllUsersPage = () => {
  const { data, isLoading } = useGetAllUserQuery(undefined);
  const [toggleBlockStatus] = useToggleBlockStatusMutation();
  const [toggleDeleteStatus] = useToggleDeleteStatusMutation();

  const AllUsers = data?.data;

  // Handle Block Toggle
  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await toggleBlockStatus(userId);
      if (res.data.success) {
        message.warning(`User is ${isBlocked ? "Unblocked" : "Blocked"}`);
      }
    } catch (error) {
      console.error("Error updating block status", error);
    }
  };

  // Handle Delete Toggle
  const handleDeleteToggle = async (userId: string, isDeleted: boolean) => {
    try {
      const res = await toggleDeleteStatus(userId);
      if (res.data.success) {
        message.warning(`User is ${isDeleted ? "Activated" : "Deleted"}`);
      }
    } catch (error) {
      console.error("Error updating delete status", error);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "SL",
      key: "serial",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Joining Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => convertDate(date),
    },
    {
      title: "Block User",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (_text, record) => (
        <Switch
          checked={record?.isBlocked}
          onChange={() => handleBlockToggle(record?._id, record?.isBlocked)}
          style={{
            backgroundColor: record?.isBlocked ? "#EF6F70" : "",
          }}
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (_text, record) => (
        <Switch
          checked={record?.isDeleted}
          onChange={() => handleDeleteToggle(record?._id, record?.isDeleted)}
          style={{
            backgroundColor: record?.isDeleted ? "#EF6F70" : "",
          }}
        />
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={AllUsers}
            pagination={false}
            rowKey="_id"
            scroll={{ x: "max-content" }}
          />
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;
