using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "The password must contain at least 1 number, 1 uppercase, 1 lowercase, and a special character like !@#%$,.")]
        public string Password { get; set; }

        [Required]
        public string DisplayName { get; set; }

        [Required]
        public string UserName { get; set; }

    }
}