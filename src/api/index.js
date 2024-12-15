import axiosInstance from "./axiosInstance";

// Đăng nhập
export const postLogin = async (data) => {
  //console.log("var: ",data);
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Đăng ký
export const postRegister = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Xác minh đăng nhập
export const postAutoLogin = async (token) => {
  try {
    const response = await axiosInstance.post(
      "/auth/check-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy danh sách user dùng phân trang
export const getUsers = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/get-all-users", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy danh sách phần cứng
export const getHardwares = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/get-all-hardwares", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Khóa tài khoản
export const lockUser = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/lock-user", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Thêm phần cứng
export const addHardware = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/create-hardware", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy thông tin phần cứng
export const getHardware = async (id) => {
  try {
    const response = await axiosInstance.post(`/admin/get-one-hardware/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Cập nhật phần cứng
export const updateHardware = async (data, id) => {
  try {
    const response = await axiosInstance.put(
      `/admin/update-hardware/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Thêm nhiều user vào phần cứng
export const setUserWithHardware = async (data) =>
{
    try {
        const response = await axiosInstance.post('/admin/set-user-with-hardware',data);
        return response.data;
    }
    catch (error)
    {
        console.error(error);
        throw error;
    } 
}

// Xóa user khỏi phần cứng
export const deleteUserWithHardware = async (data,id) =>
{
    try {
        const response = await axiosInstance.delete(`/admin/delete-user-with-hardware/${id}`,data);
        return response.data;
    }
    catch (error)
    {
        console.error(error);
        throw error;
    } 
}

// Xóa phần cứng khỏi user
export const  deleteHardwareWithUser = async (data,id) =>
{
    try {
        const response = await axiosInstance.delete(`/admin/delete-hardware-with-user/${id}`,data);
        return response.data;
    }
    catch (error)
    {
        console.error(error);
        throw error;
    } 
}

// Thêm phần cứng
export const addHardwareWithUser = async (data) =>
{
    try {
        const response = await axiosInstance.post('/admin/add-hardware-with-user',data);
        return response.data;
    }
    catch (error)
    {
        console.error(error);
        throw error;
    } 
}

// Thêm user
export const addUserWithHardware = async (data) =>
{
    try {
        const response = await axiosInstance.post('/admin/add-user-with-hardware',data);
        return response.data;
    }
    catch (error)
    {
        console.error(error);
        throw error;
    } 
}

// Lấy danh sách phần cứng theo user
export const getHardwaresWithUser = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin/get-one-user/${data}`, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy danh sách user theo phần cứng
export const getUsersWithHardware = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin/get-one-hardware/${data}`, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Lấy danh sách phần cứng có thể thêm theo user
export const getHardwaresCanAdd = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin/get-all-hardware-no-user`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Lấy danh sách user có thể thêm theo phần cứng
export const getUsersCanAdd = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin/get-all-user-no-hardware`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Xoá phần cứng theo userId
export const deleteHardware = async (id,data) => {
  try {
    const response = await axiosInstance.post(`/admin/delete-hardware-with/user/${id}`,data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Xoá user theo hardwareId
export const deleteUser = async (id,data) => {
  try {
    const response = await axiosInstance.post(`/admin/delete-user-with-hardware/${id}`,data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Ban user
export const banUser = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/ban-user", data);
    return response.data;
  } catch (error) {
    //console.log(error);
    throw error;
  }
} 

// Tìm kiếm user
export const searchUser = async (data) => {
  const username = {
    username: data
  
  }
  try {
    const response = await axiosInstance.post("/admin/get-user-by-username", username);
    return response.data;
  } catch (error) {
    //console.log(error);
    throw error;
  }
}