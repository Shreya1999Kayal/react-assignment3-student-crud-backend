const cloudinary = require("cloudinary").v2

const uploadOnCloudinary = async (fileBuffer, folder = "student-images") => {
    if (!fileBuffer) {
        throw new Error("File Buffer is required")
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id

                })
            }
        )

        stream.end(fileBuffer)
    })

}

const deleteFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
};

module.exports = uploadOnCloudinary;
module.exports.deleteFromCloudinary = deleteFromCloudinary;




