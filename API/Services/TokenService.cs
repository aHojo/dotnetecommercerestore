using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
  public class TokenService
  {
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;
    public TokenService(UserManager<User> userManager, IConfiguration config)
    {
      this._config = config;
      this._userManager = userManager;
    }

    public async Task<string> GenerateToken(User user)
    {
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName),
      };

      var roles = await _userManager.GetRolesAsync(user);
      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));

      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

      var tokenOptions = new JwtSecurityToken(
        issuer: null,
        audience: null,
        claims: claims,
        expires: DateTime.Now.AddDays(7),
        signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
    }
  }
}