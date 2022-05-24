using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;

namespace API
{
  public class Program
  {
    public static async Task Main(string[] args)
    {
      var host = CreateHostBuilder(args).Build();
      using var scope = host.Services.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
      var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
      var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

      try
      {
        // create the db and tables
        await context.Database.MigrateAsync();
        // add all the products 
        await DbInitializer.Initialize(context, userManager);
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Problem migrating data");
      }
      // same as the using up above, or defer in golang. 
      // finally {
      //   scope.Dispose();
      // }

      await host.RunAsync();

    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<Startup>();
            });
  }
}
