using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  // DONT NEED BELOW BECAUSE OF INHERITANCE - BaseAPIController has these attributes
  // [ApiController]
  // [Route("api/[controller]")]
  public class ProductsController : BaseAPIController
  {
    // dependency injections
    private readonly StoreContext _context;
    public ProductsController(StoreContext context)
    {
      this._context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
      // var products =  context.Products.ToList();
      var products = await _context.Products.ToListAsync();

      return Ok(products);
    }

    // get the id parameter
    [HttpGet("{id:int}")] // api/products/3
                          // in the params id is from the path
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
      // return context.Products.Find(id);
      var product = await _context.Products.FindAsync(id);
      if (product == null) return NotFound();

      return product;
    }
  }
}