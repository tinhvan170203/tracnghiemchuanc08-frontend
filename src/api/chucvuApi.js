import axiosConfig from "./axiosConfig";

const chucvuApi = {
    getChucvu(params){
        const url = `chuc-vu/fetch`;
        return axiosConfig.get(url, {params})
    },
    addChucvu(data){
        const url = "chuc-vu/add";
        return axiosConfig.post(url, data)
    },
    editChucvu(data){
        const url =`chuc-vu/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteChucvu(id){
        const url = `chuc-vu/delete/${id}`;
        return axiosConfig.delete(url)
    }
};

export default chucvuApi;