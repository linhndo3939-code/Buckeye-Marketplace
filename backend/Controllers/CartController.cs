using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend; 
using Microsoft.AspNetCore.Cors; // Required for CORS

namespace backend.Controllers
{
[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowReactApp")] // Added "App" to match Program.cs
public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            var items = await _context.CartItems.Include(i => i.Product).ToListAsync();
            return Ok(new Cart { Items = items });
        }

[HttpPost]
public async Task<ActionResult<CartItem>> PostCartItem(CartItem cartItem)
{
    _context.CartItems.Add(cartItem);
    await _context.SaveChangesAsync();

    // Fix: Ensure the first argument matches the name of your GET method exactly
    // If your GET method is called "GetCartItems", use that name here.
    // Change 'GetCartItems' to 'GetCart'
return CreatedAtAction(nameof(GetCart), new { id = cartItem.Id }, cartItem);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int quantity)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return NotFound();

            if (quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
            }
            else
            {
                cartItem.Quantity = quantity;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return NotFound();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var allItems = await _context.CartItems.ToListAsync();
            _context.CartItems.RemoveRange(allItems);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}