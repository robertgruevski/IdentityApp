using API.DTOs.Account;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signinManager;

		public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signingManager)
		{
			this._userManager = userManager;
			this._signinManager = signingManager;
		}

		[HttpPost("login")]
		public async Task<ActionResult<AppUserDto>> Login(LoginDto model)
		{
			var user = await _userManager.Users
				.Where(x => x.UserName == model.UserName)
				.FirstOrDefaultAsync();

			user ??= await _userManager.Users
				.Where(x => x.Email == model.UserName)
				.FirstOrDefaultAsync();

			if (user is null)
				return Unauthorized("Invalid username or password");

			var result = await _signinManager.CheckPasswordSignInAsync(user, model.Password, false);

			if (!result.Succeeded)
			{
				RemoveJwtCookie();
				return Unauthorized("Invalid username or password");
			}

			return CreateAppUserDto(user);
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterDto model)
		{
			if (await CheckEmailExistsAsync(model.Email))
				return BadRequest($"An account has been registered with '{model.Email}'. Please try using another email address.");
			if (await CheckUserNameExistsAsync(model.UserName))
				return BadRequest($"An account has been registered with '{model.UserName}'. Please try using another username.");

			var userToAdd = new AppUser
			{
				UserName = model.UserName,
				Email = model.Email,
				EmailConfirmed = true
			};

			var result = await _userManager.CreateAsync(userToAdd, model.Password);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok("Your account has been created, you can login");
		}

		#region Private Methods
		private AppUserDto CreateAppUserDto(AppUser user)
		{
			string jwt = _tokenService.CreateJWT(user);
		}
		private async Task<bool> CheckEmailExistsAsync(string email)
		{
			return await _userManager.Users.AnyAsync(x => x.Email == email);
		}
		private async Task<bool> CheckUserNameExistsAsync(string userName)
		{
			return await _userManager.Users.AnyAsync(x => x.UserName == userName);
		}
		#endregion
	}
}
