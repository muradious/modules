using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core;

using Sitecore.Diagnostics;
using System.Web.Configuration;
using CSRChat.Model;

namespace CSRChat.Utilities
{
    public class MongoOperations
    {
        #region Global Variables
        protected static IMongoClient _client;
        protected static IMongoDatabase _database; 
        #endregion

        #region Class Constructor
        public MongoOperations()
        {
            _client = new MongoClient(WebConfigurationManager.ConnectionStrings["csr.chat"].ConnectionString);
            _database = _client.GetDatabase("ChatDatabase");
        }
        #endregion

        #region Methods
        public bool InsertMessage(string From, string ToName, string ToId, string Message, DateTime TimeStamp)
        {
            try
            {
                var document = new BsonDocument
                { { "From", From }, { "ToName", ToName }, { "ToId", ToId }, { "Message", Message }, { "TimeStamp", TimeStamp },};

                var collection = _database.GetCollection<BsonDocument>("ChatLog");
                collection.InsertOne(document);

                return true;
            }
            catch (Exception exception)
            {
                Log.Error(exception.Message, this);
                return false;
            }
        }

        public List<ChatEntity> GetChatLog()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("restaurants");
                var filter = new BsonDocument();
                List<BsonDocument> liTemp = collection.Find(filter).ToList();
                List<ChatEntity> liChatLogs = new List<ChatEntity>();

                foreach (var document in liTemp)
                {
                    ChatEntity objChatEntity = new ChatEntity();
                    objChatEntity.From = System.Convert.ToString(document["From"]);
                    objChatEntity.ToId = System.Convert.ToString(document["ToId"]);
                    objChatEntity.ToName = System.Convert.ToString(document["ToName"]);
                    objChatEntity.Message = System.Convert.ToString(document["Message"]);
                    objChatEntity.TimeStamp = document[0]["TimeStamp"].ToUniversalTime();
                }

                return liChatLogs;
            }
            catch (Exception exception)
            {
                Log.Error(exception.Message, this);
                return null;
            }
        } 
        #endregion
    }
}