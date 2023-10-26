using Application.Interface;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            //When instanciating a class and its in () it means ordering is very important
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);

        }

        // First, enabling the user to upload the photo the treating the uploaded photo
        public async Task<PhotoUploadResult> AddPhoto(IFormFile File)
        {
            if(File.Length > 0)
            {
                await using var stream = File.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(File.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };
                var uploadRessult = await _cloudinary.UploadAsync(uploadParams);
                
                if(uploadRessult.Error != null)
                {
                    throw new Exception(uploadRessult.Error.Message);
                }

                return new PhotoUploadResult
                {
                    PublicId = uploadRessult.PublicId,
                    Url = uploadRessult.SecureUrl.ToString()
                };

            }

            return null;
        }

        // Deleting the photo when the user wants
        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}