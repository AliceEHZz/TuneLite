var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

app.MapGet("/csharp", () => 
    {
        return Results.Json(new { message ="Hello from C#!! Yooo Have a Nice Day!"});
    } 
);

app.Run();
