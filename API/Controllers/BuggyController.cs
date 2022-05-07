using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using System;
namespace API.Controllers
{
  public class BuggyController : BaseAPIController
  {
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
      return NotFound();
    }
    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
      var problem = new ProblemDetails();
      problem.Title = "This is a bad request";
      // return BadRequest("This is a bad request");
      return BadRequest();
    }
    [HttpGet("unauthorized")]
    public ActionResult GetUnauthorized()
    {
      return Unauthorized();
    }
    [HttpGet("validation-error")]
    public ActionResult GetValidationError()
    {
      ModelState.AddModelError("Problem1", "This is the first error");
      ModelState.AddModelError("Problem2", "This is the second error");
      return ValidationProblem();
    }
    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
      throw new Exception("This is a server error");
    }
  }
}