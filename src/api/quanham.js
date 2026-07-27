import axiosConfig from "./axiosConfig";

const quanhamApi = {
    getQuanham(params){
        const url = `quan-ham/fetch`;
        return axiosConfig.get(url, {params})
    },
    addQuanham(data){
        const url = "quan-ham/add";
        return axiosConfig.post(url, data)
    },
    editQuanham(data){
        const url =`quan-ham/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteQuanham(id){
        const url = `quan-ham/delete/${id}`;
        return axiosConfig.delete(url)
    },
    getHesoluong(params){
        const url = `quan-ham/hesoluong/fetch`;
        return axiosConfig.get(url, {params})
    },
    addHesoluong(data){
        const url = "quan-ham/hesoluong/add";
        return axiosConfig.post(url, data)
    },
    editHesoluong(data){
        const url =`quan-ham/hesoluong/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteHesoluong(id){
        const url = `quan-ham/hesoluong/delete/${id}`;
        return axiosConfig.delete(url)
    }
};

export default quanhamApi;