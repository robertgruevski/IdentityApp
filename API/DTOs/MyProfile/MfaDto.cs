namespace API.DTOs.MyProfile
{
	public class QrCodeDto
	{
		public QrCodeDto(string secret, string uri)
		{
			Secret = secret;
			Uri = uri;
		}
		public string Secret { get; set; }
		public string Uri { get; set; }
	}
}
