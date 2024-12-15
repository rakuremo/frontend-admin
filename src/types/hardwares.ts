export type HardwareData = {
    hardware_id: number;
    hardware_name: string;
    hardware_address: string;
    status: boolean;
    creator: string;
    createdAt: string;
    updatedAt: string;
};

export type AddHardwareData = {
    id: number;
    ip: string;
    hardware_name: string;
    hardware_address: string;
    status: boolean;
    creator: string;
    createdAt: string;
    updatedAt: string;
};