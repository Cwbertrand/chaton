using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.MiddleWare
{

    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        // RequestDelegate: function that processes HttpRequest
        // ILogger: Helping to output the exception to the console
        // IHostEnvironment: determine which environment mode we're in dev or prod
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
            IHostEnvironment env)
        {
                _env = env;
                _logger = logger;
                _next = next;
        }

        // This method name must be called InvokeAsync b/c when the application receives a request,
        // it will pass through this method to process the logic first
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // when the request comes in, it passes it next (_next) to the catch block
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                //setting the response status code
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new AppException(context.Response.StatusCode, "Internal Server Error");

                // That's how we format json by default when returning it
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var jsonResponse = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(jsonResponse);
            }
        }


            
    }

}