using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Always call the base method first when using Identity
        base.OnModelCreating(builder);

        // 1. Set Decimal Precision
        builder.Entity<CartItem>().Property(c => c.Price).HasPrecision(18, 2);
        builder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
        builder.Entity<OrderItem>().Property(oi => oi.Price).HasPrecision(18, 2);
        builder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(18, 2);

        // 2. Seed Products
        builder.Entity<Product>().HasData(
            new Product 
            { 
                Id = 1, 
                Title = "Hibbeler Dynamics Textbook", 
                Description = "Used engineering dynamics textbook - comprehensive and well-maintained", 
                Price = 50m, 
                Category = "Textbooks", 
                SellerName = "EngineeringSenior99", 
                PostedDate = DateTime.UtcNow.AddDays(-10), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "Like New" 
            },
            new Product 
            { 
                Id = 2, 
                Title = "TI-84 Plus", 
                Description = "Graphing calculator perfect for engineering coursework", 
                Price = 60m, 
                Category = "Electronics", 
                SellerName = "BuckeyeTech", 
                PostedDate = DateTime.UtcNow.AddDays(-8), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "Like New" 
            },
            new Product 
            { 
                Id = 3, 
                Title = "4K Monitor 27-inch", 
                Description = "Ultra HD monitor - ideal for CAD and design work", 
                Price = 120m, 
                Category = "Electronics", 
                SellerName = "JulieW", 
                PostedDate = DateTime.UtcNow.AddDays(-5), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "Used - Good" 
            },
            new Product 
            { 
                Id = 4, 
                Title = "Mechanical Keyboard", 
                Description = "RGB mechanical keyboard with hot-swap switches", 
                Price = 40m, 
                Category = "Electronics", 
                SellerName = "MikeEE", 
                PostedDate = DateTime.UtcNow.AddDays(-12), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "Like New" 
            },
            new Product 
            { 
                Id = 5, 
                Title = "Arduino Starter Kit", 
                Description = "Complete Arduino starter kit with sensors and components", 
                Price = 45m, 
                Category = "Tools", 
                SellerName = "SarahDev", 
                PostedDate = DateTime.UtcNow.AddDays(-4), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "New" 
            },
            new Product 
            { 
                Id = 6, 
                Title = "Digital Multimeter", 
                Description = "Professional grade multimeter for electronics testing", 
                Price = 35m, 
                Category = "Tools", 
                SellerName = "AlexBuilder", 
                PostedDate = DateTime.UtcNow.AddDays(-2), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "Used - Good" 
            },
            new Product 
            { 
                Id = 7, 
                Title = "Breadboard Set with Components", 
                Description = "Prototyping breadboards with resistors, capacitors, and wires", 
                Price = 25m, 
                Category = "Tools", 
                SellerName = "ChrisTools", 
                PostedDate = DateTime.UtcNow.AddDays(-6), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "New" 
            },
            new Product 
            { 
                Id = 8, 
                Title = "USB-C Power Bank 20000mAh", 
                Description = "High-capacity power bank with fast charging support", 
                Price = 35m, 
                Category = "Electronics", 
                SellerName = "TaylorElectro", 
                PostedDate = DateTime.UtcNow.AddDays(-1), 
                ImageUrl = "https://picsum.photos/200", 
                Condition = "Like New" 
            }
        );
    }
}