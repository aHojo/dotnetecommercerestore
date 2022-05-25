using System.Collections.Generic;
using System.Linq.Expressions;
using System.Net;
using System.Text;
using API.Data;
using API.Entities;
using API.MiddleWare;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace API
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddControllers();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
          Description = "Jwt Auth Header",
          Name = "Authorization",
          In = ParameterLocation.Header,
          Type = SecuritySchemeType.ApiKey,
          Scheme = "Bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement{
          {
            new OpenApiSecurityScheme
            {
              Reference = new OpenApiReference
              {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
              },
              Scheme = "oauth2",
              Name = "Bearer",
              In = ParameterLocation.Header
            },
            new List<string>()
          }
        });
      });
      services.AddDbContext<StoreContext>(opt =>
      {
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });

      services.AddCors();
      services.AddIdentityCore<User>(opt =>
      {
        opt.User.RequireUniqueEmail = true;
      })
      .AddRoles<IdentityRole>()
      // Adds all the identity tables
      .AddEntityFrameworkStores<StoreContext>();

      // JWT stuff added so that [Authorize] annotation can check the JWT
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(opt =>
      {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = false,
          ValidateAudience = false,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWTSettings:TokenKey"]))
        };
      });

      // 
      services.AddAuthorization();
      // Will only live for the dureation of the HTTPRequest
      // This lets us inject it into the constructors of our controllers. 
      services.AddScoped<TokenService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    // THIS IS FOR MIDDLEWARE
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      // ORDER MATTERS IN THIS
      app.UseMiddleware<ExceptionMiddleware>();

      if (env.IsDevelopment())
      {
        // This causes an error now that we are using our own exception handling class "ExceptionMiddleware".
        // app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
      }

      // app.UseHttpsRedirection();

      app.UseRouting();

      // must be used here or it will fail.
      app.UseCors(opt =>
      {
        opt.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials() // allows us to pass cookies 
        .WithOrigins("http://localhost:3000");
      });

      // Add this middleware so that the service above in ConfigureServices works.
      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
