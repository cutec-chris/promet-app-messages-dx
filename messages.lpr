library messages;

  uses js, web, classes, Avamm, webrouter, AvammForms, dhtmlx_base,
    dhtmlx_form,SysUtils, Types;

type

  { TStatisticsForm }

  { TMessagesForm }

  TMessagesForm = class(TAvammForm)
    constructor Create(mode: TAvammFormMode; aDataSet: string; Id: JSValue;
  Params: string=''); override;
    procedure ToolbarButtonClick(id : string);override;
    procedure DoSave; override;
  end;

  TMessagesList = class(TAvammListForm)
  protected
    procedure ToolbarButtonClick(id: string); override;
  end;

resourcestring
  strMessage              = 'Nachricht';
  strMessages             = 'Nachrichten';
  strNewMessage           = 'Neue Nachricht';

var
  Messages : TAvammListForm = nil;
Procedure ShowMessages(URl : String; aRoute : TRoute; Params: TStrings);
var
  aForm: TAvammForm;
  tmp: String;
begin
  if Assigned(Params) then
    tmp := Params.Values['Id'];
  aForm := TMessagesForm.Create(fmInlineWindow,'message',tmp);
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
    Messages.Page.cells('b').progressOff;
  end;
  procedure GridRowSelected(id : string);
  var
    aURL: String;
  begin
    aURL := '/message/blobdata/data/'+string(Messages.Grid.getSelectedRowId())+'.dat';
    LoadData(aurl)._then(TJSPromiseResolver(@MessageLoaded));
    Messages.Page.cells('b').progressOn;
  end;
begin
  if Messages = nil then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      Messages := TMessagesList.Create(aParent,'message','2E');
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
          Toolbar.addButton('new',0,'','fa fa-plus-circle');
        end;
    end;
  Messages.Show;
end;

constructor TMessagesForm.Create(mode: TAvammFormMode; aDataSet: string;
  Id: JSValue; Params: string);
begin
  inherited Create(mode, aDataSet, Id, Params);
  Toolbar.addButton('send',0,'Senden','fa fa-send');
  SetTitle(strNewMessage);
end;

procedure TMessagesForm.ToolbarButtonClick(id: string);
var
  aUrl : string;
  aContent : string;
  aId : string;
  MessageFields, Message: TJSObject;
  ContentFields, Content: TJSObject;

  function MessageSaved2(aValue: TJSXMLHttpRequest): JSValue;
  begin
    Toolbar.enableItem('send');
    if aValue.Status=200 then
      begin
        DoClose;
      end
    else
      raise Exception.Create(aValue.responseText);
    DoClose;
  end;
  function MessageSaved(aValue: TJSXMLHttpRequest): JSValue;
  begin
    if aValue.Status=200 then
      begin
        //get id
        aId := aValue.getResponseHeader('UID');
        Content := js.new(['Fields',ContentFields]);
        aURL := '/message/blobdata/data/'+aId+'.dat';
        StoreData(aurl,TJSJSON.stringify(Message))._then(TJSPromiseResolver(@MessageSaved2));
      end
    else
      raise Exception.Create(aValue.responseText);
  end;

begin
  if id = 'send' then
    begin
      Toolbar.disableItem('send');
      aURL := '/message/new/item.json';
      aContent := 'This is a test Content';
      MessageFields := TJSObject.new;
      MessageFields.Properties['subject'] := 'Test';
      MessageFields.Properties['sender'] := 'Test@testmann.de';
      Message := js.new(['Fields',MessageFields]);
      StoreData(aurl,TJSJSON.stringify(Message))._then(TJSPromiseResolver(@MessageSaved));
    end
  else
  inherited ToolbarButtonClick(id);
end;

procedure TMessagesForm.DoSave;
begin
  //prevent to save Message double
end;

procedure TMessagesList.ToolbarButtonClick(id: string);
begin
  if (id = 'new') then
    begin
      ShowMessages('/messages/by-id/new',nil,nil);
    end
  else
    inherited ToolbarButtonClick(id);
end;

{ TMessagesForm }

initialization
  if getRight('Messages')>0 then
    RegisterSidebarRoute(strMessages,'messages',@ShowMessagesList,'fa-envelope');
  Router.RegisterRoute('/messages/by-id/:Id/',@ShowMessages);
end.

