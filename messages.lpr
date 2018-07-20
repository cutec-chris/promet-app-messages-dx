library messages;
  uses js, web, classes, Avamm, webrouter, AvammForms, dhtmlx_base,
    dhtmlx_form,SysUtils, Types;

type

  { TStatisticsForm }

  TMessagesForm = class(TAvammForm)
  end;

resourcestring
  strMessage              = 'Nachricht';
  strMessages             = 'Nachrichten';

var
  Messages : TAvammListForm = nil;
Procedure ShowMessages(URl : String; aRoute : TRoute; Params: TStrings);
var
  aForm: TAvammForm;
begin
  aForm := TMessagesForm.Create(fmInlineWindow,'message',Params.Values['Id']);
end;


Procedure ShowMessagesList(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
  function MessageLoaded(aValue: TJSXMLHttpRequest): JSValue;
  var
    aDiv: TJSElement;
  begin
    if aValue.Status=200 then
      begin
        Messages.Page.cells('b').detachObject(true);
        aDiv := document.createElement('div');
        aDiv.innerHTML:='<pre>'+aValue.responseText+'</pre>';
        Messages.Page.cells('b').appendObject(aDiv);
        Messages.Page.cells('b').expand;
      end
    else
      begin
        raise Exception.Create(aValue.responseText);
      end;
  end;
  procedure GridRowSelected(id : string);
  var
    aURL: String;
  begin
    aURL := '/message/blobdata/data/'+string(Messages.Grid.getSelectedRowId())+'.dat';
    LoadData(aurl)._then(TJSPromiseResolver(@MessageLoaded));
  end;
begin
  if Messages = nil then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      Messages := TAvammListForm.Create(aParent,'message','2E');
      with Messages do
        begin
          Grid.setHeader('Betreff,Von,Datum');
          Grid.setColumnIds('SUBJECT,SENDER,SENDDATE');
          Grid.setInitWidths('*,150,100');
          FilterHeader := '#text_filter,#text_filter,#text_filter';
          Grid.init();
          Page.cells('b').collapse;
          Page.cells('b').setText(strMessage);
          Grid.attachEvent('onRowSelect',@GridRowSelected);
        end;
    end;
  Messages.Show;
end;

initialization
  if getRight('Messages')>0 then
    RegisterSidebarRoute(strMessages,'messages',@ShowMessagesList,'fa-envelope');
  Router.RegisterRoute('/messages/by-id/:Id/',@ShowMessages);
end.

