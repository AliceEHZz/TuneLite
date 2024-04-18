var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);
var app = builder.Build();

app.MapGet("/csharp", () => 
    {
        return Results.Json(new { message = "Hello From C#", language = "Language is csharp"});
    } 
);

app.Run();
