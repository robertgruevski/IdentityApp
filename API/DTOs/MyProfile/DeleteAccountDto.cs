using System.ComponentModel.DataAnnotations;

namespace API.DTOs.MyProfile
{
	public class DeleteAccountDto : EditProfileBaseDto
	{
		private string _currentUsername;
		[Required]
		public string CurrentUsername 
		{
			get => _currentUsername;
			set => _currentUsername = value.ToLower();
		}
		public bool Confirmation { get; set; }
	}
}
