import axiosConfig from "./axiosConfig";

const apiApi = {
    getDiaphuongs(params){
        const url = `/api/dia-phuong/list`;
        return axiosConfig.get(url, {params})
    },
    addDiaphuong(data){
        const url = "/api/dia-phuong/";
        return axiosConfig.post(url, data)
    },
    editDiaphuong(data){
        const url =`/api/dia-phuong/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteDiaphuong(id){
        const url = `/api/dia-phuong/${id}`;
        return axiosConfig.delete(url)
    },
    thongkeToanquoc(params){
         const url = `/api/toan-quoc`;
        return axiosConfig.get(url, {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
    },
    fetchFanpageToanquoc(params){
        const url = `/api/toan-quoc/fanpage`;
        return axiosConfig.get(url, {
            params,
            paramsSerializer: {
                // list=a&list=b — Express nhận mảng đúng
                indexes: null,
            },
        })
    },
    fetchAiChatToanquoc(params){
        const url = `/api/toan-quoc/ai-chat`;
        return axiosConfig.get(url, {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
    }
};

export default apiApi;