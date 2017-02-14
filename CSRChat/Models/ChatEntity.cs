using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CSRChat.Model
{
    public class ChatEntity
    {
        public string From { get; set; }
        public string ToName { get; set; }
        public string ToId { get; set; }
        public string Message { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}