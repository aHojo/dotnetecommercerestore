using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
  public class PagedList<T> : List<T>
  {
    public MetaData MetaData { get; set; }
    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
      MetaData = new MetaData
      {
        TotalCount = count,
        PageSize = pageSize,
        CurrentPage = pageNumber,
        TotalPages = (int)Math.Ceiling(count / (double)pageSize) // if 18 products -> pageSize = 10 -> we have 2 pages 18/10 round up = 2
      };
      // we need this to add the items to the response. TODO: figure out how this works??? 
      AddRange(items);
    }

    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
    {
      // executes against the DB here
      var count = await query.CountAsync();
      // if on page 1 and 10 items per page 1-1 = 0 * 10 = 0
      // if on page 2 10 items 2-1 * 10 = 10 - so skip 10 records, then take 10 more. 
      // executes on the db
      var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

      return new PagedList<T>(items, count, pageNumber, pageSize);
    }
  }
}