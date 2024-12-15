"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InputGroup from "@/components/FormElements/InputGroup";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { AddHardwareData } from "@/types/addHardwareData";
import { addHardware } from "@/api/index";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

const CreateHardware: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraCount, setCameraCount] = useState<number>(0);
  const [isCameraCountLocked, setIsCameraCountLocked] = useState<boolean>(false);
  const [hardwareData, setHardwareData] = useState<AddHardwareData>({
    hardware_name: "",
    hardware_address: "",
    cameras: [],
  });

  const handleCameraCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isCameraCountLocked) {
      const count = Number(e.target.value);
      setCameraCount(count);
      setHardwareData((prevData) => ({
        ...prevData,
        cameras: Array(count).fill({ camera_name: "", camera_url: "" }),
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (name.startsWith("camera_")) {
      const updatedCameras = [...hardwareData.cameras];
      if (index !== undefined) {
        updatedCameras[index] = {
          ...updatedCameras[index],
          [name]: value,
        };
        setHardwareData({ ...hardwareData, cameras: updatedCameras });
      }
    } else {
      setHardwareData({ ...hardwareData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addHardware(hardwareData);
      toast.success("Hardware added successfully, redirecting to page hardware...");
      setTimeout(() => {
        router.push("/hardwares");
      }, 3000);
    } catch (error) {
      toast.error("Failed to add hardware");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleLockCameraCount = () => {
    if (cameraCount) setIsCameraCountLocked(true);
  };

  const handleResetCameraCount = () => {
    setCameraCount(0);
    setIsCameraCountLocked(false);
    setHardwareData({ ...hardwareData, cameras: [] });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hardwares" subPageName="CreateHardware" />
      <ToastContainer />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="Hardware name"
                    type="text"
                    placeholder="Enter your hardware name"
                    name="hardware_name"
                    customClasses="w-full xl:w-1/2"
                    required
                    onChange={handleInputChange}
                    disabled={isCameraCountLocked}
                  />
                </div>

                <InputGroup
                  label="Address"
                  type="text"
                  placeholder="Enter your hardware address"
                  name="hardware_address"
                  customClasses="mb-4.5"
                  required
                  onChange={handleInputChange}
                  disabled={isCameraCountLocked}
                />

                <div className="mb-4.5">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Number of Cameras<span className="text-red">*</span>
                  </label>

                  <div className="relative z-0 mb-3 flex items-center gap-4 bg-transparent dark:bg-dark-2">
                    <input
                      type="number"
                      value={cameraCount}
                      onChange={handleCameraCountChange}
                      className="relative z-0 w-2/3 appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary xl:w-1/3"
                      disabled={isCameraCountLocked}
                      min="1"
                    />

                    <button
                      type="button"
                      className={`mt-2 mx-left rounded-[7px] p-[10px] font-medium text-white ${
                        isCameraCountLocked
                          ? "bg-green-500 hover:bg-green-400"
                          : "bg-red-500 hover:bg-red-400"
                      }`}
                      onClick={handleLockCameraCount}
                      disabled={isCameraCountLocked}
                    >
                      Confirm Count
                    </button>

                    <button
                      type="button"
                      className="mt-2 mx-left rounded-[7px] p-[10px] font-medium text-white bg-yellow-500 hover:bg-yellow-400"
                      onClick={handleResetCameraCount}
                      disabled={!isCameraCountLocked}
                    >
                      Reset Count
                    </button>
                  </div>

                  {isCameraCountLocked &&
                    [...Array(cameraCount)].map((_, index) => (
                      <div key={index} className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                          label={`Camera ${index + 1} name`}
                          type="text"
                          placeholder="Enter your camera name"
                          name="camera_name"
                          customClasses="w-full xl:w-1/2"
                          required
                          onChange={(e) => handleInputChange(e, index)}
                          disabled={!isCameraCountLocked}
                        />
                        <InputGroup
                          label={`Camera ${index + 1} link`}
                          type="text"
                          placeholder="Enter your camera link"
                          name="camera_url"
                          customClasses="w-full xl:w-1/2"
                          required
                          onChange={(e) => handleInputChange(e, index)}
                          disabled={!isCameraCountLocked}
                        />
                      </div>
                    ))}
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                >
                  {loading ? <ClipLoader size={20} color={"#fff"} /> : "Add hardware"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-6 z-50">
              <Dialog.Title className="text-lg font-bold">
                Confirm Add Hardware
              </Dialog.Title>
              <div className="mt-4">
                Are you sure you want to add this hardware?
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="mr-2 rounded bg-gray-300 px-4 py-2 text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color={"#fff"} /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </DefaultLayout>
  );
};

export default CreateHardware;
