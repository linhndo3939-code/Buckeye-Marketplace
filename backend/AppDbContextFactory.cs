using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            
            // Pointing directly to your Azure SQL Database
            optionsBuilder.UseSqlServer("Server=tcp:buckeye-market-server-linhn.database.windows.net,1433;Initial Catalog=BuckeyeMarketDB;Persist Security Info=False;User ID=dbadmin;Password=BuckeyeMarket!2026;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}