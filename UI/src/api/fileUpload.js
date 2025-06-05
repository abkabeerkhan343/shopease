// import axios from "axios";
// import { API_BASE_URL, getHeaders } from "./constant";


// export const fileUploadAPI = async (data)=>{
//     const url = API_BASE_URL + `/api/file`;
//     try{
//         const response = await axios(url,{
//             method:"POST",
//             headers:{
//                 ...getHeaders(),
//                 'Content-Type': 'multipart/form-data'
//             },
//             data:data
//         });
//         return response?.data;
//     }
//     catch(err){
//         throw new Error(err);
//     }
// }
import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const fileUploadAPI = async (file, fileName) => {
  const url = `${API_BASE_URL}/api/file`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getHeaders(), // Add auth token if needed
      },
    });
    return response.data;
  } catch (err) {
    console.error("Upload error:", err?.response?.data || err.message);
    throw err;
  }
};
