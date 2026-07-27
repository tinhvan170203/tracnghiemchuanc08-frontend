import axiosCommon from "./axiosCommon";
import axiosConfig from "./axiosConfig";

const userApi = {
    login(data){
        const url = 'c08/auth/login';
        return axiosCommon.post(url, data)
    }, 
    changePage(data){
        const url = 'c08/auth/change-pass';
        return axiosConfig.post(url, data)
    }, 
    logout(){
        const url = `c08/auth/logout`;
        return axiosConfig.get(url)
    },
    getMe(){
        const url = `c08/auth/me`;
        return axiosConfig.get(url)
    },
    getUsers(page){
        const url = `c08/auth/users/fetch`;
        return axiosConfig.get(url, {params: {page: page}})
    },
    addUser(data){
        const url = "c08/auth/users/add";
        return axiosConfig.post(url, data)
    },
    editUser(data){
        const url =`c08/auth/users/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteUser(id){
        const url = `c08/auth/users/delete/${id}`;
        return axiosConfig.delete(url)
    },
    editQuanlydonvi(data){
        const url =`c08/auth/users/edit-phanquyendonvi/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
};

export default userApi;