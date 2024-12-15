export type AddHardwareData = {
    hardware_name: string;
    hardware_address: string;
    cameras: CameraData[];
};

export type CameraData = {
    camera_name: string;
    camera_url: string;
};