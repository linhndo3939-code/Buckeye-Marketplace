using Microsoft.EntityFrameworkCore;
using backend;

var builder = WebApplication.CreateBuilder(args);

// 1. Setup the policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin()  // This allows any website to call your API
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
        // This will create the database file and all tables if they don't exist
        context.Database.EnsureCreated();
        Console.WriteLine("Database check complete: buckeye_marketplace.db is ready.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database creation failed: {ex.Message}");
    }
}
// -------------------------------
// --- THE ORDER BELOW IS CRITICAL ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. Routing MUST come before CORS
app.UseRouting();

// 3. CORS MUST come after Routing but BEFORE Authorization/MapControllers
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();