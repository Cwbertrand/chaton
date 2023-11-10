using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interface
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile File);

        Task<string> DeletePhoto(string publicId);
    }
}