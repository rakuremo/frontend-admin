"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InputGroup from "@/components/FormElements/InputGroup";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SignUpData } from "@/types/signUpData";
import { postRegister } from "@/api/index";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateHardware: React.FC = () => {
  const router = useRouter();
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: "",
    username: "",
    password: "",
  });


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      //console.log("data: ", signUpData);
      const res = await postRegister(signUpData);
      //console.log("res: ", res);
      toast.success("Sign up successfully");

    } catch (error: any) {
      console.log("error: ", error);
      toast.error(error.response.data.message ||"Sign up failed");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" subPageName="CreateUser" />
      <ToastContainer />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Sign Up
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <InputGroup
                  label="Name"
                  type="text"
                  placeholder="Enter full name"
                  name="name"
                  customClasses="mb-4.5"
                  required
                  onChange={handleInputChange}
                />

                <InputGroup
                  label="Username"
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  customClasses="mb-4.5"
                  required
                  onChange={handleInputChange}
                />

                <InputGroup
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  customClasses="mb-4.5"
                  required
                  onChange={handleInputChange}
                />

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateHardware;
