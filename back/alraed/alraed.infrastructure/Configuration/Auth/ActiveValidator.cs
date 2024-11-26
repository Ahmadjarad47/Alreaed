using alraed.Core.DTOs.AuthDto;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.infrastructure.Configuration.Auth
{
    public class ActiveValidator : AbstractValidator<ActiveRequest>
    {
        public ActiveValidator()
        {
            RuleFor(x => x.Email)
          .NotEmpty().WithMessage("Email is required.")
          .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.token).NotEmpty().NotNull().WithMessage("Token is required");
        }
    }
}
