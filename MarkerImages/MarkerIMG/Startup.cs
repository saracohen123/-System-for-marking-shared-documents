using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DI_Factory;
using infraDALContracts;
using MarkerContracts.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using DALimpSQL;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Threading;
using MarkerContracts.DTO;

namespace MarkerIMG
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var resolver = new Resolver(services);
            services.AddSingleton<IInfraDal, SQLDAL>();
            //services.AddSingleton<IDBConnection, SQLConnectionAdapter>();
            //services.AddSingleton<IDBParameter, SqlParameterAdapter>();
            services.AddControllers();
            services.AddTransient<ISocket, WebSocketAdapter>();
            services.AddSingleton<IMessanger, WebSocketMessangerAdapter>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseWebSockets();
            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/ws")
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                        var docid = context.Request.Query["docid"];
                        var userid = context.Request.Query["userid"];
                        var messanger = app.ApplicationServices.GetService<IMessanger>();
                        var webSocketAdapter = new WebSocketAdapter();
                        webSocketAdapter.Socket = webSocket;
                        await messanger.Add( userid,docid, webSocketAdapter);
                        //await messanger.Send(userid, docid, "connect");
                        await webSocket.ReceiveAsync(new Memory<byte>(), CancellationToken.None);

                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                    }
                }
                else
                {
                    await next();
                }
            });
            app.UseHttpsRedirection();

            //app.UseRouting();

            //app.UseAuthorization();

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //});

            //--
            app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });

            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });



        }
    }
}
