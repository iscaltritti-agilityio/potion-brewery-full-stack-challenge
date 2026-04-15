using Microsoft.Data.Sqlite;
using PotionBrewery.Api;
using PotionBrewery.Database;

var builder = WebApplication.CreateBuilder(args);

// In-memory SQLite — singleton connection kept open
var connection = new SqliteConnection("Data Source=:memory:");
connection.Open();
builder.Services.AddSingleton(connection);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services
    .AddGraphQLServer()
    .AddQueryType<PotionQuery>()
    .AddMutationType<PotionMutation>()
    .AddInputObjectType<PotionOrderFilterInput>(d => d.Name("PotionOrderFilter"))
    .AddInputObjectType<PotionOrderInput>(d => d.Name("PotionOrderInput"));

var app = builder.Build();

// Initialize database
DbInit.Initialize(app.Services.GetRequiredService<SqliteConnection>());

app.UseCors();

// REST endpoints
app.MapAlchemistEndpoints();

// GraphQL
app.MapGraphQL("/graphql");

// Health check
app.MapGet("/health", () => new { status = "OK", timestamp = DateTime.UtcNow });

var port = Environment.GetEnvironmentVariable("PORT") ?? "4000";
app.Run($"http://0.0.0.0:{port}");
