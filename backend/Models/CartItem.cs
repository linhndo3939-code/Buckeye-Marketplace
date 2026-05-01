using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        // Link to the Product table
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        // These store the 'Snapshot' of the item details
        public string Title { get; set; } = string.Empty; 
        public decimal Price { get; set; }

        [Range(1, 100)]
        public int Quantity { get; set; }

        // Identifies which user this cart belongs to
        public string UserId { get; set; } = "default-user";
    }
}