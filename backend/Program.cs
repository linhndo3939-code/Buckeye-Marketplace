using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
   options.UseSqlite("Data Source=buckeyemarket.db"));

 //builder.Services.AddDbContext<backend.AppDbContext>(options => 
   // options.UseSqlServer("Server=tcp:buckeye-market-server-linhn.database.windows.net,1433;Initial Catalog=BuckeyeMarketDB;Persist Security Info=False;User ID=dbadmin;Password=BuckeyeMarket!2026;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));

// 2. Identity Configuration (Milestone 5)
// Updated to include Role services
builder.Services.AddIdentityCore<IdentityUser>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true; 
    options.Password.RequiredLength = 8;
})
.AddRoles<IdentityRole>() // This is crucial for Admin features!
.AddRoleManager<RoleManager<IdentityRole>>()
.AddEntityFrameworkStores<AppDbContext>();

// 3. Authentication & JWT (Milestone 5)
var jwtKey = builder.Configuration["Jwt:Key"]; 
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT Key is missing! Run 'dotnet user-secrets set \"Jwt:Key\" \"YOUR_KEY\"' in the backend folder.");
}

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization(options => {
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
});

builder.Services.AddControllers();

// 4. CORS Strategy
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors();

// 5. Middleware Pipeline
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers(); 

// --- SEEDING LOGIC START (Milestone 5 Requirement) ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    // Create Roles if they don't exist
    string[] roles = { "Admin", "Student" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // Seed Admin User
    var adminEmail = "admin@osu.edu";
    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var admin = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
        await userManager.CreateAsync(admin, "Admin123!");
        await userManager.AddToRoleAsync(admin, "Admin");
    }

    // Seed Regular User
    var studentEmail = "student@osu.edu";
    if (await userManager.FindByEmailAsync(studentEmail) == null)
    {
        var student = new IdentityUser { UserName = studentEmail, Email = studentEmail, EmailConfirmed = true };
        await userManager.CreateAsync(student, "Student123!");
        await userManager.AddToRoleAsync(student, "Student");
    }
}
// --- SEEDING LOGIC END ---

app.Run();