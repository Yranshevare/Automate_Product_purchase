// import cloudinary from "cloudinary";

function extractPublicId(url) {
    const parts = url.split('/');
    const fileNameWithExt = parts[parts.length - 1];  // e.g., sample.jpg
    const fileName = fileNameWithExt.split('.')[0];   // sample
    const folder = parts[parts.length - 2];           // myfolder (if any)

    return `${fileName}`; // returns "myfolder/sample"
}


export default extractPublicId