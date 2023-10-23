namespace API.DTOs
{
    //Data which will be transferred to the user from the server
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }

    }
}