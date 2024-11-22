import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/mutation/auth";

interface Payload {
  username: string;
  password: string;
  batch: number;
  contact: string;
  job: string;
  address: string;
  firstname: string;
  lastname: string;
  role: "ADMIN" | "USER";
}

const Register:React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { mutate, isPending} = useMutation({
    mutationFn: async (payload: Payload) => {
      return await register(payload);
    },
    onSuccess: () => {
      notification.success({
        message: 'Register Successful',
        description: 'You can now login!',
      });
      navigate("/");
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const submit = (values: Payload) => {
    mutate({
      ...values,
      batch: Number(values.batch),
      role: "USER",
    })
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-300">
      <div className="w-[600px] flex border rounded-[20px] shadow-lg bg-white">
        <div className="w-full flex flex-col items-center p-5">
          <h1 className="font-semibold text-2xl mb-10">Register</h1>
          <div className="w-full">
            <Form onFinish={submit} layout="vertical">
              {error && (
                <p className="mb-2 text-red-500">
                  {error}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="username"
                  label="Username"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Username is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Password is required" }]}
                >
                  <Input.Password type="password" autoComplete="off" size="large" />
                </Form.Item>
                <Form.Item
                  name="firstname"
                  label="Firstname"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Firstname is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="lastname"
                  label="Lastname"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Lastname is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="batch"
                  label="Year graduated"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Year graduated is required" }]}
                >
                  <Input type="number" min="1900" max="9999" size="large" />
                </Form.Item>
                <Form.Item
                  name="contact"
                  label="Mobile number"
                  className="col-span-2 sm:col-span-1"
                  rules={[
                    { required: true, message: "Mobile number is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Mobile number must be exactly 10 digits",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    addonBefore="+63"
                    maxLength={10}
                    minLength={10} 
                  />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Current address"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="job"
                  label="Current job"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Job is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <Button
                type="primary"
                title="Register using credentials"
                htmlType="submit"
                className="w-full mt-4"
                size="large"
                loading={isPending}
                disabled={isPending}
              >
                Register
              </Button>
            </Form>
          </div>
          <div className="mt-10 text-gray-500">
            Have an account?{" "}
            <span
              className="cursor-pointer text-blue-500 hover:text-gray-500"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
