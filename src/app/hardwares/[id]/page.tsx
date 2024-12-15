"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InputGroup from "@/components/FormElements/InputGroup";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AddHardwareData, CameraData } from "@/types/addHardwareData";
import { getHardware, updateHardware } from "@/api/index";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import TableUserHardware from "@/components/Tables/TableUserHardware";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

const UpdateHardware: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hardwareData, setHardwareData] = useState<AddHardwareData>({
    hardware_name: "",
    hardware_address: "",
    cameras: [],
  });

  useEffect(() => {
    const fetchHardware = async () => {
      try {
        const res = await getHardware(id); // Lấy dữ liệu hardware từ server
        setHardwareData(res.data);
      } catch (error) {
        toast.error("Failed to fetch hardware data");
      }
    };
    fetchHardware();
  }, [id]);

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
      const sentData = {
        hardware_name: hardwareData.hardware_name,
        hardware_address: hardwareData.hardware_address,
        cameras: hardwareData.cameras,
      };
      await updateHardware(sentData, id);
      toast.success("Hardware updated successfully");
    } catch (error) {
      toast.error("Failed to update hardware");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleAddCamera = () => {
    setHardwareData((prevData) => ({
      ...prevData,
      cameras: [...prevData.cameras, { camera_name: "", camera_url: "" }],
    }));
  };

  const handleRemoveCamera = (index: number) => {
    const updatedCameras = [...hardwareData.cameras];
    updatedCameras.splice(index, 1);
    setHardwareData({ ...hardwareData, cameras: updatedCameras });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hardwares" subPageName="UpdateHardware" />
      <ToastContainer />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-2">
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
                    value={hardwareData.hardware_name}
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
                  value={hardwareData.hardware_address}
                />

                <div className="mb-4.5">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Cameras
                  </label>

                  {hardwareData.cameras.map((camera, index) => (
                    <div key={index} className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                      <InputGroup
                        label={`Camera ${index + 1} name`}
                        type="text"
                        placeholder="Enter your camera name"
                        name="camera_name"
                        customClasses="w-full xl:w-1/2"
                        required
                        onChange={(e) => handleInputChange(e, index)}
                        value={camera.camera_name}
                      />
                      <InputGroup
                        label={`Camera ${index + 1} link`}
                        type="text"
                        placeholder="Enter your camera link"
                        name="camera_url"
                        customClasses="w-full xl:w-1/2"
                        required
                        onChange={(e) => handleInputChange(e, index)}
                        value={camera.camera_url}
                      />
                      <button
                        type="button"
                        className="mt-2 mx-left rounded-[7px] p-[10px] font-medium text-white bg-red-500 hover:bg-red-400"
                        onClick={() => handleRemoveCamera(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 mx-left rounded-[7px] p-[10px] font-medium text-white bg-blue-500 hover:bg-blue-400"
                    onClick={handleAddCamera}
                  >
                    Add Camera
                  </button>
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                >
                  {loading ? <ClipLoader size={20} color={"#fff"} /> : "Update hardware"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-3">
          <TableUserHardware hardwareId={Number(id)} />
        </div>
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-6">
              <Dialog.Title className="text-lg font-bold">
                Confirm Update
              </Dialog.Title>
              <div className="mt-4">
                Are you sure you want to update this hardware?
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

export default UpdateHardware;
