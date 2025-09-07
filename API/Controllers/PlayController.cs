using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class PlayController : ControllerBase
	{
		[HttpGet("get-players")]
		public IActionResult GetPlayers()
		{
			return Ok(new { message = "Only authorized users can view players" });
		}
	}
}
