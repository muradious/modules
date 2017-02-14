using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Owin;
using Microsoft.Owin;
using Sitecore.Pipelines;
using System.Web.Routing;

[assembly: OwinStartup(typeof(CSRChat.Utilities.RegisterSignalrProcessor))]
namespace CSRChat.Utilities
{
    public class RegisterSignalrProcessor
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }

        public virtual void Process(PipelineArgs args)
        {
            
        }

    }
}