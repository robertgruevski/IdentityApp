using API.DTOs;
using API.DTOs.MyProfile;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
	[Authorize]
	public class MyProfileController : ApiCoreController
	{
		[HttpGet]
		public async Task<ActionResult<MyProfileDto>> GetMyProfile()
		{
			var userProfile = await Context.Users
				.Where(x => x.Id == User.GetUserId())
				.Select(x => new MyProfileDto
				{
					Name = x.Name,
					Email = x.Email
				}).FirstOrDefaultAsync();

			if (userProfile is null)
				return NotFound();

			return userProfile;
		}

		[HttpPut("change-password")]
		public async Task<ActionResult<ApiResponse>> ChangePassword(ChangePasswordDto model)
		{
			var user = await UserManager.FindByNameAsync(User.GetUserName());
			if (user is null)
				return NotFound();

			var message = await UserPasswordValidationAsync(user, model.CurrentPassword);
			if (!string.IsNullOrEmpty(message))
				return Unauthorized(new ApiResponse(401, message: message, displayByDefault: true, isHtmlEnabled: true));

			var result = await UserManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
			if (!result.Succeeded)
				return BadRequest(new ApiResponse(400));

			return Ok(new ApiResponse(200, message: "Your password has been changed successfully.", showWithToastr: true));
		}
	}
}
