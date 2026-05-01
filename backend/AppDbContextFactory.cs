using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            
            // MATCH THIS TO PROGRAM.CS
            optionsBuilder.UseSqlite("Data Source=buckeye_marketplace.db");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}