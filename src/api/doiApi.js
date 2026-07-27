import axiosConfig from "./axiosConfig";

const doiApi = {
    getDoi(params){
        const url = `api/doi/fetch`;
        return axiosConfig.get(url, {params})
    },
    addDoi(data){
        const url = "api/doi/add";
        return axiosConfig.post(url, data)
    },
    editDoi(data){
        const url =`api/doi/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteDoi(id, params){
        const url = `api/doi/delete/${id}`;
        return axiosConfig.delete(url,{params})
    }
};

export default doiApi;