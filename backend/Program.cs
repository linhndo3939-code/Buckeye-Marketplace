using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using backend;

var builder = WebApplication.CreateBuilder(args);
// 1. Add JWT Authentication Services
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "your-auth-server", // Change this to your domain
        ValidAudience = "buckeye-marketplace-users",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKey_MustBeLongEnough123!"))
    };
});

// Add this single block
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Your React URL
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=buckeye_marketplace.db")); 

var app = builder.Build();

// --- FORCE DATABASE CREATION ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated();
        Console.WriteLine("Database check complete: buckeye_marketplace.db is ready.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database creation failed: {ex.Message}");
    }
}

// --- MIDDLEWARE PIPELINE (THE CRITICAL ORDER) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// --- MUST BE IN THIS ORDER ---

app.UseRouting(); // 1. Identify the route

// 2. CORS MUST come after Routing but BEFORE Authentication/Authorization
app.UseCors("AllowReactApp"); 

app.UseAuthentication(); // 3. Who are you?
app.UseAuthorization();  // 4. Are you allowed?

app.MapControllers();
app.Run();