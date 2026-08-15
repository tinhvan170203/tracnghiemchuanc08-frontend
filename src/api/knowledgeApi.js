import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const knowledgeApi = {
  list: () => axiosConfig.get("api/ai-knowledge"),
  upload: (formData) => axiosMulter.post("api/ai-knowledge/upload", formData),
  remove: (id) => axiosConfig.delete(`api/ai-knowledge/${id}`),
};

export default knowledgeApi;
