rtl.module("messages",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","dhtmlx_base","SysUtils"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TMessagesForm",pas.AvammForms.TAvammForm,function () {
    this.Create$1 = function (mode, aDataSet, Id, Params) {
      pas.AvammForms.TAvammForm.Create$1.call(this,mode,aDataSet,Id,Params);
    };
    this.ToolbarButtonClick = function (id) {
      if (id === "new") {
        $mod.ShowMessages("\/messages\/new",null,null);
      } else pas.AvammForms.TAvammForm.ToolbarButtonClick.call(this,id);
    };
  });
  this.Messages = null;
  this.ShowMessages = function (URl, aRoute, Params) {
    var aForm = null;
    aForm = $mod.TMessagesForm.$create("Create$1",[pas.AvammForms.TAvammFormMode.fmInlineWindow,"message",Params.GetValue("Id"),""]);
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
      return Result;
    };
    function GridRowSelected(id) {
      var aURL = "";
      aURL = ("\/message\/blobdata\/data\/" + ("" + $mod.Messages.Grid.getSelectedRowId())) + ".dat";
      pas.Avamm.LoadData(aURL,false,"",6000).then(MessageLoaded);
    };
    if ($mod.Messages === null) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.Messages = pas.AvammForms.TAvammListForm.$create("Create$2",[aParent,"message","2E"]);
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
  $mod.$resourcestrings = {strMessage: {org: "Nachricht"}, strMessages: {org: "Nachrichten"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("Messages") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.messages,"strMessages"),"messages",$mod.ShowMessagesList,"fa-envelope");
    pas.webrouter.Router().RegisterRoute("\/messages\/by-id\/:Id\/",$mod.ShowMessages,false);
  };
});
//# sourceMappingURL=messages.js.map
