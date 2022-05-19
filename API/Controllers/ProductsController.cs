using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
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
    // string orderBy is assumed to be a queryString variable ?orderby=something
    public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
      // var products =  context.Products.ToList();
      // This is to just get the list of our products
      // var products = await _context.Products.ToListAsync();
      // return Ok(products);

      // System.Linq.IQueryable<Product>
      var query = _context.Products
      .Sort(productParams.OrderBy) // this is from our extension.
      .Search(productParams.SearchTerm)
      .Filter(productParams.Brands, productParams.Types)
      .AsQueryable();

      var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

      Response.AddPaginationHeader(products.MetaData);

      return products;
      // return await query.ToListAsync();

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
    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
      var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
      var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

      // Anonymous object
      return Ok(new { brands, types });

    }
  }
}