using API.DTOs.Account;
using API.Models;
using API.Services.IServices;
using API.Utility;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
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
		private readonly ITokenService _tokenService;
		private readonly IConfiguration _config;

		public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signingManager, ITokenService tokenService, IConfiguration config)
		{
			this._userManager = userManager;
			this._signinManager = signingManager;
			this._tokenService = tokenService;
			this._config = config;
		}

		[Authorize]
		[HttpGet("refresh-appuser")]
		public async Task<ActionResult<AppUserDto>> RefreshAppUser()
		{
			var user = await _userManager.Users.Where(x => x.Id == User.GetUserId()).FirstOrDefaultAsync();

			if(user is null)
			{
				RemoveJwtCookie();
				return Unauthorized();
			}

			return CreateAppUserDto(user);
		}

		[HttpGet("auth-status")]
		public IActionResult IsLoggedIn()
		{
			return Ok(new { IsAuthenticated = User.Identity?.IsAuthenticated ?? false });
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
				return BadRequest($"An account has been registered with '{model.Email}'. Please try using another email address");
			if (await CheckNameExistsAsync(model.Name))
				return BadRequest($"An account has been registered with '{model.Name}'. Please try using another name (username)");

			var userToAdd = new AppUser
			{
				Name = model.Name,
				UserName = model.Name.ToLower(),
				Email = model.Email,
				EmailConfirmed = true,
				LockoutEnabled = true
			};

			var result = await _userManager.CreateAsync(userToAdd, model.Password);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok("Your account has been created, you can login");
		}

		[HttpGet("name-taken")]
		public async Task<IActionResult> NameTaken([FromQuery] string name)
		{
			return Ok(new { IsTaken = await CheckNameExistsAsync(name) });
		}

		[HttpGet("email-taken")]
		public async Task<IActionResult> EmailTaken([FromQuery] string email)
		{
			return Ok(new { IsTaken = await CheckEmailExistsAsync(email) });
		}

		[Authorize]
		[HttpPost("logout")]
		public IActionResult Logout()
		{
			RemoveJwtCookie();
			return NoContent();
		}

		#region Private Methods
		private AppUserDto CreateAppUserDto(AppUser user)
		{
			string jwt = _tokenService.CreateJWT(user);
			SetJwtCookie(jwt);

			return new AppUserDto
			{
				UserName = user.UserName,
				JWT = jwt
			};
		}
		private void SetJwtCookie(string jwt)
		{
			var cookieOptions = new CookieOptions
			{
				IsEssential = true,
				HttpOnly = true,
				Secure = true,
				Expires = DateTime.UtcNow.AddDays(int.Parse(_config["JWT:ExpiresInDays"])),
				SameSite = SameSiteMode.None
			};

			Response.Cookies.Append(SD.IdentityAppCookie, jwt, cookieOptions);
		}
		private void RemoveJwtCookie()
		{
			Response.Cookies.Delete(SD.IdentityAppCookie);
		}
		private async Task<bool> CheckEmailExistsAsync(string email)
		{
			return await _userManager.Users.AnyAsync(x => x.Email == email);
		}
		private async Task<bool> CheckNameExistsAsync(string name)
		{
			return await _userManager.Users.AnyAsync(x => x.UserName == name);
		}
		#endregion
	}
}
