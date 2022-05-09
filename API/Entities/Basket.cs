using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
  public class Baskets
  {
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItem> Items { get; set; } = new List<BasketItem>();

    // these methods are only doing things in memory, they are not using the database. 
    public void AddItem(Product product, int quantity)
    {

      // If item is not already in our list add the item
      if (Items.All(item => item.ProductId != product.Id))
      {
        Items.Add(new BasketItem { Product = product, Quantity = quantity });
      }

      var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
      if (existingItem != null) existingItem.Quantity += quantity;
    }

    public void RemoveItem(int productId, int quantity)
    {
      var item = Items.FirstOrDefault(item => item.ProductId == productId);
      if (item == null) return;

      item.Quantity -= quantity;
      if (item.Quantity == 0) Items.Remove(item);
    }
  }
}