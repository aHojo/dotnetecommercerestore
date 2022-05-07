
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System.Reflection.Metadata;
using System;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.MiddleWare
{
  public class ExceptionMiddleware
  {
    private RequestDelegate _next;
    private ILogger<ExceptionMiddleware> _logger;
    private IHostEnvironment _env;
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
      this._env = env;
      this._logger = logger;
      this._next = next;

    }

    // This is NEEDED for middleware
    public async Task InvokeAsync(HttpContext context)
    {

      try
      {
        await _next(context);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, ex.Message);
        context.Response.ContentType = "applicatoin/json";
        context.Response.StatusCode = 500;
        var response = new ProblemDetails
        {
          Status = 500,
          Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
          Title = ex.Message,
        };

        var options = new JsonSerializerOptions();
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
      }

    }
  }
}