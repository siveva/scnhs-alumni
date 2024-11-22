import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircleOutlined, DeleteOutlined, LikeOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Input, notification, Table, Typography, Spin } from "antd";
import Navbar from "../component/Navbar";
import { getAllUsers } from "../services/query/user";
import { approved, deleteUser } from "../services/mutation/auth";
import { useAuth } from "../provider/AuthProvider";
import { IUser } from "../interfaces/user.interface";
import { BASE_URL } from "../utils/axios-config";

const AdminUserPage: React.FC = () => {
  const { session: { user } } = useAuth();
  const { Title, Text } = Typography;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: !!user?.id,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [batchFilter, setBatchFilter] = useState<string | null>(null);

  const filteredData = data?.filter((item) => {
    const matchesName =
      !searchTerm ||
      item?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.firstname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter
      ? item?.batch?.toString()?.includes(batchFilter)
      : true;
    return matchesName && matchesBatch;
  });

  const { mutate: approveUser } = useMutation({
    mutationFn: approved,
    onSuccess: () => {
      refetch();
      notification.success({
        message: "Success",
        description: "User has been approved",
      });
    },
    onError: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      refetch();
      notification.success({
        message: "Success",
        description: "User has been deleted",
      });
    },
    onError: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name and Profession",
      render: (_text: any, record: IUser) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={record?.image ? BASE_URL + "/uploads/" + record.image : undefined}
            size={40}
            className="cursor-pointer"
          >
            {record.firstname?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <div>
            <Text className="font-semibold">{`${record?.firstname ?? "N/A"} ${record?.lastname ?? "N/A"}`}</Text>
            <br />
            <Text type="secondary">{record?.job || "No Job Information"}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Contact #",
      dataIndex: "contact",
    },
    {
      title: "Current Address",
      dataIndex: "address",
    },
    {
      title: "Batch",
      dataIndex: "batch",
    },
    {
      title: "Actions",
      render: (_text: any, record: IUser) => (
        <div className="flex space-x-3">
          {!record.isApproved ? (
            <LikeOutlined
              onClick={() => approveUser(record.id)}
              className="text-orange-500 cursor-pointer hover:text-orange-700"
            />
          ) : (
            <CheckCircleOutlined className="text-green-500" />
          )}
          <DeleteOutlined
            onClick={() => deleteUserMutation(record.id)}
            className="text-red-500 cursor-pointer hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <Title level={3} className="text-gray-800">
            Alumni Users Management
          </Title>
          <Text type="secondary">Manage alumni users, approve accounts, and delete users if necessary.</Text>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name"
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            className="w-full md:w-1/2"
          />
          <Input
            prefix={<SearchOutlined />}
            placeholder="Filter by batch"
            onChange={(e) => setBatchFilter(e.target.value)}
            size="large"
            className="w-full md:w-1/2"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            className="rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
