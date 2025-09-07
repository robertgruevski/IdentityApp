using API.Models;
using API.Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
	public class ContextInitializer
	{
		public static async Task InitializeAsync(Context context, UserManager<AppUser> userManager)
		{
			if(context.Database.GetPendingMigrations().Count() > 0)
			{
				await context.Database.MigrateAsync();
			}

			if(!userManager.Users.Any())
			{
				var robert = new AppUser
				{
					Name = "ROBERT",
					UserName = "robert",
					Email = "robert@example.com",
					EmailConfirmed = true,
					LockoutEnabled = true
				};
				await userManager.CreateAsync(robert, SD.DefaultPassword);

				var peter = new AppUser
				{
					Name = "PETER",
					UserName = "peter",
					Email = "peter@example.com",
					EmailConfirmed = true,
					LockoutEnabled = true
				};
				await userManager.CreateAsync(peter, SD.DefaultPassword);

				var tom = new AppUser
				{
					Name = "TOM",
					UserName = "tom",
					Email = "tom@example.com",
					EmailConfirmed = true,
					LockoutEnabled = true
				};
				await userManager.CreateAsync(tom, SD.DefaultPassword);

				var barb = new AppUser
				{
					Name = "BARB",
					UserName = "barb",
					Email = "barb@example.com",
					EmailConfirmed = true,
					LockoutEnabled = true
				};
				await userManager.CreateAsync(barb, SD.DefaultPassword);
			}
		}
	}
}
