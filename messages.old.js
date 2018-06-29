var Messages;
window.addEventListener('AfterLogin',function(){
  Messages = newPrometList('message','Nachrichten');
  Messages.Layout = Messages.Page.attachLayout('2E');
  var a = Messages.Layout.cells('a');
  a.hideHeader();
	var b = Messages.Layout.cells('b');
	b.hideHeader();
  b.setHeight('30%');
  Messages.Grid = a.attachGrid({parent:a});
  Messages.Grid.setImagePath("codebase/imgs/");
  Messages.Grid.setSizes();
  Messages.Grid.enableAlterCss("even","uneven");
  Messages.Grid.setEditable(false);
  Messages.Grid.attachEvent("onFilterStart", function(indexes,values){
    OldFilter = '';
    for (var i = 0; i < indexes.length; i++) {
      if (values[i]!='')
        OldFilter += ' AND lower("'+Messages.Grid.getColumnId(indexes[i])+'")'+' like lower(\'%'+values[i]+'%\')';
    }
    OldFilter = OldFilter.substring(5,OldFilter.length);
    Messages.Page.progressOn();
    try {
      Messages.DataSource.FillGrid(Messages.Grid,OldFilter,0,function (){
        Messages.Page.progressOff();
      });
    } catch(err) {
      Messages.Page.progressOff();
    }
  });
  Messages.Grid.setHeader(["Betreff","Von","Datum"]);
  Messages.Grid.setColumnIds('SUBJECT,SENDER,SENDDATE')
  Messages.Grid.setColTypes("ro,ro,ro");
  Messages.Grid.attachHeader("#text_filter,#text_filter,#text_filter");
  Messages.Grid.setInitWidths('*,150,100');
  Messages.Grid.init();
  Messages.Grid.attachEvent("onRowDblClicked",function(){
    OpenElement('message',Messages.Grid.getSelectedRowId(),Messages);
  });
  Messages.Grid.attachEvent("onRowSelect",function(){
    var aURL = '/'+Messages.TableName+'/blobdata/data/'+Messages.Grid.getSelectedRowId()+'.dat';
    if (window.LoadData(aURL,function(aData){
      try {
        if ((aData)&&(aData.xmlDoc))
        var aData2;
        var aID;
        Messages.Layout.cells('b').attachHTMLString(aData.xmlDoc.responseText);
      } catch(err) {
        console.log(Messages.TableName,'failed to load data !',err);
      }
    })==true) {
    }
    else {
      if (Callback)
        Callback();
      dhtmlx.message({
        type : "error",
        text: "Login erforderlich",
        expire: 3000
      });
    }
  });
  Messages.OnCreateForm = function(aForm) {
    aForm.Tabs.addTab(
    "content",       // id
    "Inhalt",    // tab text
    null,       // auto width
    null,       // last position
    false,      // inactive
    true);
    aForm.Tabs.tabs("content").attachHTMLString('<div id="NoContent"><p><br>Nachricht wird geladen...</p></div>');
    aForm.Tabs.tabs("content").setActive();
    aForm.Tabs.tabs("content").progressOn();
  }
});
window.addEventListener('AfterLogout',function(){
  Messages.Grid.destructor();
  Messages.Page.remove();
  delete Messages;
  Messages = {};
  Messages = null;
});
