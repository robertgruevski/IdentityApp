using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Utility
{
	public static class SD
	{

		//Regex
		public const string UserNameRegex = "^[a-zA-Z0-9_.-]*$";
		public const string EmailRegex = "^.+@[^\\.].*\\.[a-z]{2,}$";

		//Application Rules
		public const int RequiredPasswordLength = 6;
		public const int MaxFailedAccessAttempts = 3;
		public const int DefaultLockoutTimeSpanInDays = 1;
	}
}
