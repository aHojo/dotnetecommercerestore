using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ProductsController : ControllerBase
  {
    // dependency injections
    private readonly StoreContext context;
    public ProductsController(StoreContext context)
    {
      this.context = context;
    }

    [HttpGet]
    public ActionResult<List<Product>> GetProducts()
    {
      var products = context.Products.ToList();

      return Ok(products);
    }

    // get the id parameter
    [HttpGet("{id}")] // api/products/3
                      // in the params id is from the path
    public ActionResult<Product> GetProduct(int id)
    {
      return context.Products.Find(id);
    }
  }
}