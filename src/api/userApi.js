import axiosCommon from "./axiosCommon";
import axiosConfig from "./axiosConfig";

const userApi = {
    login(data){
        const url = 'api/auth/login';
        return axiosCommon.post(url, data)
    }, 
    changePage(data){
        const url = 'api/auth/change-pass';
        return axiosConfig.post(url, data)
    }, 
    logout(){
        const url = `api/auth/logout`;
        // axiosCommon: không bắn alert 403 khi token đã hết hạn
        return axiosCommon.get(url)
    },
    getMe(){
        const url = `api/auth/me`;
        return axiosConfig.get(url)
    },
    getUsers(page){
        const url = `api/auth/users/fetch`;
        return axiosConfig.get(url, {params: {page: page}})
    },
    addUser(data){
        const url = "api/auth/users/add";
        return axiosConfig.post(url, data)
    },
    editUser(data){
        const url =`api/auth/users/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    resetPassword(id, data){
        const url = `api/auth/users/reset-password/${id}`;
        return axiosConfig.put(url, data)
    },
    deleteUser(id){
        const url = `api/auth/users/delete/${id}`;
        return axiosConfig.delete(url)
    },
    editQuanlydonvi(data){
        const url =`api/auth/users/edit-phanquyendonvi/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
};

export default userApi;