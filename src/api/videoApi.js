import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const videoApi = {
    getVideos(params){
        const url = `/api/video/fetch`;
        return axiosConfig.get(url, {params})
    },
    incView(params){
        const url = `/api/video/tang-view`;
        return axiosConfig.get(url, {params})
    },
   addVideo(data, onProgress, params = {}) {
        const url = "/api/video/add";
        return axiosMulter.post(url, data, {
            params,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percent);
                }
            }
        });
    },
    editVideo(data, params = {}){
        const url =`/api/video/edit/${data.id_edit}`;
        return axiosConfig.put(url, data, { params })
    },
    setActive(id, data){
        const url = `/api/video/${id}/active`;
        return axiosConfig.put(url, data);
    },
    deleteVideo(id, params){
        const url = `/api/video/delete/${id}`;
        return axiosConfig.delete(url, {params})
    }
};

export default videoApi;
