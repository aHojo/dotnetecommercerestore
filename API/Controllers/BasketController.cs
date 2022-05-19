using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class BasketController : BaseAPIController
  {
    private readonly StoreContext _context;
    public BasketController(StoreContext context)
    {
      this._context = context;
    }
    // Fetch a basket
    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
      Basket basket = await RetrieveBasket();

      if (basket == null)
      {

        return NotFound();
      }

      return MapBasketToDto(basket);

    }



    // add to a basket
    [HttpPost] // api/basket?productId=3&quantity=2
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {

      // get the basket ||  if doesn't have a basket, create it
      var basket = await RetrieveBasket();
      if (basket == null)
      {
        // create cookie too - happens in method CreateBasket();
        basket = CreateBasket();
      }

      // get product
      var product = await _context.Products.FindAsync(productId);
      if (product == null)
      {
        return BadRequest(new ProblemDetails(Title = "Product Not Found"));
      }
      // add the item
      basket.AddItem(product, quantity);
      // save the changes.
      var result = await _context.SaveChangesAsync() > 0; // returns the number of changes that happen in the database

      // if (result) return StatusCode(201);
      if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));


      return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
    }


    // remove an item
    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
      // get basket
      var basket = await RetrieveBasket();
      if (basket == null) return NotFound();
      // remove item or reduce quantity
      basket.RemoveItem(productId, quantity);
      // save changes 
      var result = await _context.SaveChangesAsync() > 0;

      if (result) return Ok();

      return BadRequest(new ProblemDetails { Title = "Problem deleting an item" });
    }

    private async Task<Basket> RetrieveBasket()
    {
      var basket = await _context.Baskets
                .Include(i => i.Items) // joins basket and basketitem
                .ThenInclude(p => p.Product) // joins basketiem => products
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
      return basket;
    }

    private Basket CreateBasket()
    {
      var buyerId = Guid.NewGuid().ToString();
      var cookieOptions = new CookieOptions
      {
        IsEssential = true,
        Expires = DateTime.Now.AddDays(30)
      };
      Response.Cookies.Append("buyerId", buyerId, cookieOptions);

      var basket = new Basket { BuyerId = buyerId };
      _context.Baskets.Add(basket);
      return basket;
    }

    private BasketDto MapBasketToDto(Basket basket)
    {
      return new BasketDto
      {
        Id = basket.Id,
        BuyerId = basket.BuyerId,
        items = basket.Items.Select(item => new BasketItemDto
        {
          ProductId = item.ProductId,
          Name = item.Product.Name,
          Price = item.Product.Price,
          PictureUrl = item.Product.PictureUrl,
          Type = item.Product.Type,
          Brand = item.Product.Brand,
          Quantity = item.Quantity
        }).ToList()
      };
    }
  }

}