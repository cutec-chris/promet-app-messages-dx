rtl.module("messages",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","dhtmlx_base","SysUtils","Types"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TMessagesForm",pas.AvammForms.TAvammForm,function () {
    this.Create$1 = function (mode, aDataSet, Id, Params) {
      pas.AvammForms.TAvammForm.Create$1.call(this,mode,aDataSet,Id,Params);
      this.Toolbar.addButton("send",0,"Senden","fa fa-send");
      this.SetTitle(rtl.getResStr(pas.messages,"strNewMessage"));
    };
    this.ToolbarButtonClick = function (id) {
      var Self = this;
      var aUrl = "";
      var aContent = "";
      var aId = "";
      var MessageFields = null;
      var Message = null;
      var ContentFields = null;
      var Content = null;
      function MessageSaved2(aValue) {
        var Result = undefined;
        Self.Toolbar.enableItem("send");
        if (aValue.status === 200) {
          Self.DoClose();
        } else throw pas.SysUtils.Exception.$create("Create$1",[aValue.responseText]);
        Self.DoClose();
        return Result;
      };
      function MessageSaved(aValue) {
        var Result = undefined;
        if (aValue.status === 200) {
          aId = aValue.getResponseHeader("UID");
          Content = pas.JS.New(["Fields",ContentFields]);
          aUrl = ("\/message\/blobdata\/data\/" + aId) + ".dat";
          pas.Avamm.StoreData(aUrl,JSON.stringify(Message),false,"",6000).then(MessageSaved2);
        } else throw pas.SysUtils.Exception.$create("Create$1",[aValue.responseText]);
        return Result;
      };
      if (id === "send") {
        Self.Toolbar.disableItem("send");
        aUrl = "\/message\/new\/item.json";
        aContent = "This is a test Content";
        MessageFields = new Object();
        MessageFields["subject"] = "Test";
        MessageFields["sender"] = "Test@testmann.de";
        Message = pas.JS.New(["Fields",MessageFields]);
        pas.Avamm.StoreData(aUrl,JSON.stringify(Message),false,"",6000).then(MessageSaved);
      } else pas.AvammForms.TAvammForm.ToolbarButtonClick.call(Self,id);
    };
    this.DoSave = function () {
    };
  });
  rtl.createClass($mod,"TMessagesList",pas.AvammForms.TAvammListForm,function () {
    this.ToolbarButtonClick = function (id) {
      if (id === "new") {
        $mod.ShowMessages("\/messages\/by-id\/new",null,null);
      } else pas.AvammForms.TAvammListForm.ToolbarButtonClick.call(this,id);
    };
  });
  this.Messages = null;
  this.ShowMessages = function (URl, aRoute, Params) {
    var aForm = null;
    var tmp = "";
    if (Params != null) tmp = Params.GetValue("Id");
    aForm = $mod.TMessagesForm.$create("Create$1",[2,"message",tmp,""]);
  };
  this.ShowMessagesList = function (URl, aRoute, Params) {
    var aParent = null;
    function MessageLoaded(aValue) {
      var Result = undefined;
      var aDiv = null;
      if (aValue.status === 200) {
        $mod.Messages.Page.cells("b").detachObject(true);
        aDiv = document.createElement("div");
        aDiv.innerHTML = ("<pre>" + aValue.responseText) + "<\/pre>";
        $mod.Messages.Page.cells("b").appendObject(aDiv);
        $mod.Messages.Page.cells("b").expand();
      } else {
        throw pas.SysUtils.Exception.$create("Create$1",[aValue.responseText]);
      };
      $mod.Messages.Page.cells("b").progressOff();
      return Result;
    };
    function GridRowSelected(id) {
      var aURL = "";
      aURL = ("\/message\/blobdata\/data\/" + ("" + $mod.Messages.Grid.getSelectedRowId())) + ".dat";
      pas.Avamm.LoadData(aURL,false,"",6000).then(MessageLoaded);
      $mod.Messages.Page.cells("b").progressOn();
    };
    if ($mod.Messages === null) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.Messages = $mod.TMessagesList.$create("Create$2",[aParent,"message","2E"]);
      var $with1 = $mod.Messages;
      $with1.Grid.setHeader("Betreff,Von,Datum");
      $with1.Grid.setColumnIds("SUBJECT,SENDER,SENDDATE");
      $with1.Grid.setInitWidths("*,150,100");
      $with1.SetFilterHeader("#text_filter,#text_filter,#text_filter");
      $with1.Grid.init();
      $with1.Page.cells("b").collapse();
      $with1.Page.cells("b").setText(rtl.getResStr(pas.messages,"strMessage"));
      $with1.Grid.attachEvent("onRowSelect",GridRowSelected);
      $with1.Toolbar.addButton("new",0,"","fa fa-plus-circle");
    };
    $mod.Messages.Show();
  };
  $mod.$resourcestrings = {strMessage: {org: "Nachricht"}, strMessages: {org: "Nachrichten"}, strNewMessage: {org: "Neue Nachricht"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("Messages") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.messages,"strMessages"),"messages",$mod.ShowMessagesList,"fa-envelope");
    pas.webrouter.Router().RegisterRoute("\/messages\/by-id\/:Id\/",$mod.ShowMessages,false);
  };
});
//# sourceMappingURL=messages.js.map
