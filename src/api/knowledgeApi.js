import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const knowledgeApi = {
  list: () => axiosConfig.get("c08/ai-knowledge"),
  upload: (formData) => axiosMulter.post("c08/ai-knowledge/upload", formData),
  remove: (id) => axiosConfig.delete(`c08/ai-knowledge/${id}`),
};

export default knowledgeApi;
