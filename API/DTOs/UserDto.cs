namespace API.DTOs
{
    //Data which will be transferred to the user from the server
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Image { get; set; }
        public string UserName { get; set; }

    }
}