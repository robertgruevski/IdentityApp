using API.Data;
using API.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ApiCoreController : ControllerBase
	{
		private Context _context;
		private IConfiguration _config;
		private IServiceUnitOfWork _services;
		protected IConfiguration Configuration => _config ??= HttpContext.RequestServices.GetService<IConfiguration>();
		protected Context Context => _context ??= HttpContext.RequestServices.GetService<Context>();
		protected IServiceUnitOfWork Services => _services ??= HttpContext.RequestServices.GetService<IServiceUnitOfWork>();

		protected int TokenExpiresInMinutes()
		{
			return int.Parse(Configuration["Email:TokenExpiresInMinutes"]);
		}

		protected string GetClientUrl()
		{
			return Configuration["JWT:ClientUrl"];
		}
	}
}
