using System.Xml;

using Converter.Hubs;
using Converter.Models;
using Converter.Scripts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "React App");
    options.RoutePrefix = "swagger";
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseFileServer();

app.UseEndpoints(endpoints =>
{
    endpoints.MapPost("/send-data", 
        (string measureFrom, string measureTo, decimal valueFrom, decimal valueTo) =>
    {
        try
        {
            var data = new ConverterData()
            {
                MeasureFrom = measureFrom,
                MeasureTo = measureTo,
                ValueFrom = valueFrom,
                ValueTo = valueTo
            };
            
            XmlHandler.ConfigureXml(data);
            XmlHandler.WriteHtml();
        }
        catch (Exception e)
        {
            return new PostResponse()
            {
                Success = false,
                Message = e.Message
            };
        }

        return new PostResponse()
        {
            Success = true
        };
    });

    endpoints.MapHub<ConverterHub>("/converter");
});

app.Run();