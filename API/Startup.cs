using API.Data;
using API.Entities;
using API.MiddleWare;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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

      services.AddAuthentication();
      services.AddAuthorization();
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

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
