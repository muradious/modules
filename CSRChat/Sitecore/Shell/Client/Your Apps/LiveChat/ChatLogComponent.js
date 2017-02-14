define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
        this._super();
        var app = this;
        app.set("WFFMParam", '');
        app.GetChatLogData(app);
    }
      ,
    GetChatLogData: function (app) {
        jQuery.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/sitecore/Chat/GetChatLog",
            cache: false,
            success: function (data) {
                app.set("ChatLogParam", data);
            },
            error: function () {
                console.log("There was an error in GetChatLogData() function!");
            }
        });
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  Sitecore.Factories.createComponent("ChatLogComponent", model, view, ".sc-listcontrol");
});
