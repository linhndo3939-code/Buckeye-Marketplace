using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Range(0.01, 5000)]
        public decimal Price { get; set; }
        
        [Required]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        public string SellerName { get; set; } = string.Empty;
        
        public DateTime PostedDate { get; set; }
        
        public string ImageUrl { get; set; } = string.Empty;
        
        public string Condition { get; set; } = string.Empty;
    }
}
