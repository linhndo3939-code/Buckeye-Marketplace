using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend; // FIXED: Changed from backend.Data to backend
using backend.Models;

namespace backend.Controllers;

[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")] 
    public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
    {
        return await _context.Orders.Include(o => o.OrderItems).ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] List<OrderItemDto> items)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized("User not found in token.");

        decimal total = items.Sum(item => item.Price);

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.Now,
            TotalAmount = total,
            Status = "Pending", 
            OrderItems = items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductTitle = i.ProductTitle,
                Price = i.Price
            }).ToList()
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(new { orderId = order.Id, total = order.TotalAmount });
    }
}

public record OrderItemDto(int ProductId, string ProductTitle, decimal Price);