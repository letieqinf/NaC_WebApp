using Microsoft.AspNetCore.SignalR;

namespace Converter.Hubs;

public class ConverterHub : Hub
{
    public async Task Send(string data)
    { 
        await Clients.Caller.SendAsync("Receive", $"[YOU AT {DateTime.Now.ToShortTimeString()}] {data}");
        await Clients.Others.SendAsync("Receive", $"[OTHER AT {DateTime.Now.ToShortTimeString()}] {data}");
    }
}