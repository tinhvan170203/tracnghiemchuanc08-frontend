import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const videoApi = {
    getVideos(params){
        const url = `/c08/video/fetch`;
        return axiosConfig.get(url, {params})
    },
    incView(params){
        const url = `/c08/video/tang-view`;
        return axiosConfig.get(url, {params})
    },
   addVideo(data, onProgress) {
        const url = "/c08/video/add";
        return axiosMulter.post(url, data, {
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percent); // Bắn % về cho Component
                }
            }
        });
    },
    editVideo(data){
        const url =`/c08/video/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteVideo(id,params){
        const url = `/c08/video/delete/${id}`;
        return axiosConfig.delete(url, {params})
    }
};

export default videoApi;