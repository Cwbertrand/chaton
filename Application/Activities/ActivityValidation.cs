using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidation : AbstractValidator<Activity>
    {
        public ActivityValidation()
        {
            // An error occurrs if the field is empty
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }
}