import axiosConfig from "./axiosConfig";

const c08Api = {
    getDiaphuongs(params){
        const url = `/c08/dia-phuong/list`;
        return axiosConfig.get(url, {params})
    },
    addDiaphuong(data){
        const url = "/c08/dia-phuong/";
        return axiosConfig.post(url, data)
    },
    editDiaphuong(data){
        const url =`/c08/dia-phuong/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteDiaphuong(id){
        const url = `/c08/dia-phuong/${id}`;
        return axiosConfig.delete(url)
    },
    thongkeToanquoc(params){
         const url = `/c08/toan-quoc`;
        return axiosConfig.get(url, {params})
    }
};

export default c08Api;