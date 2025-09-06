using API.Models;
using API.Services.IServices;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Services
{
	public class TokenService : ITokenService
	{
		private readonly IConfiguration _config;
		private readonly SymmetricSecurityKey _jwtKey;

		public TokenService(IConfiguration config)
		{
			this._config = config;
			_jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
		}
		public string CreateJWT(AppUser user)
		{
			throw new System.NotImplementedException();
		}
	}
}
