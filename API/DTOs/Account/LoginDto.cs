using API.Utility;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account
{
	public class LoginDto
	{
		private string _userName;
		[Required]
		[StringLength(15, MinimumLength = 3, ErrorMessage = "Username must be at least {2}, and maximum {1} characters")]
		[RegularExpression(SD.UserNameRegex, ErrorMessage = "Username must contain only a-z A-Z 0-9 characters")]
		public string UserName
		{
			get => _userName;
			set => _userName = value.ToLower();
		}
		[Required]
		public string Password { get; set; }
	}
}
