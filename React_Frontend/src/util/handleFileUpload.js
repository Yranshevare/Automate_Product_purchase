import axios from 'axios'

export default async function uploadFile(file) {
    try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", import.meta.env.VITE_CLOUD_PREST);
        data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
        
        
        const res = await axios.post("https://api.cloudinary.com/v1_1/dknlbzgap/auto/upload", data);
        return res.data.url
    } catch (error) {
        console.log(error)
        return null
    }
}