using System;
using System.Collections.Generic;
using API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var host = CreateHostBuilder(args).Build();
      using var scope = host.Services.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
      var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

      try
      {
        // create the db and tables
        context.Database.Migrate();
        // add all the products 
        DbInitializer.Initialize(context);
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Problem migrating data");
      }
      // same as the using up above, or defer in golang. 
      // finally {
      //   scope.Dispose();
      // }

      host.Run();

    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<Startup>();
            });
  }
}
