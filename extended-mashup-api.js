define(["js/qlik"], function(qlik){
	var extended = qlik;
  //app
  include "extensions/app/app.js"
  return extended;

  function getObject(id, callbackFn){
    var msg = {
        "method": "GetObject",
        "handle": this.model.handle,
        "params": [
            id
        ],
        "jsonrpc": "2.0"
    }
    this.model.session.rpc(msg).then(function(response){
      callbackFn.call(null, response);
    });
  };

  function getLayout(handle, callbackFn){
    msg = {
      method: "GetLayout",
      handle: handle,
      params: [],
      delta: true,
      jsonrpc: "2.0"
    };
    //get the "Layout"
    this.model.session.rpc(msg).then(function(response){
      callbackFn.call(null, response);
    });
  };
});
