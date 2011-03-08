
var tipBox = (function(element,text,options){
	 
	if(typeof element == 'string'){
		element = '#' + element;
	
		if(document.querySelector(element)==null)
			throw new Exception('Element ' + element + " does not exist!");
	}
	
	 var _target = (typeof element == 'string') ? document.querySelector(element): element,
         _text = text,
         _tipBox,
         _showTimer,
         _hideTimer,
         _visible = false,
         _getObjKeys = function(obj){
	   			if(typeof obj != 'Object')
	   				return [];
	   		
	   			var keys = [];
	   			for(var prop in obj)
	   				keys.push(prop);
	   			
	   			return keys;
	   		},
	   	_getObjVars = function(obj){
	   			if(typeof obj != 'Object')
	   				return [];
	   		
	   			var vars = [];
	   			for(var prop in obj)
	   				vars.push(obj[prop]);
	   			
	   			return vars;
	   		},
         _mergeOptions = function(destination,source){
	   			var property,prop;
	   			for (property in source){
	   				if(_getObjVars(destination[property]).length>0 && this._getObjVars(source[property]).length>0){
	   					for(prop in source[property])
	   	 			 		destination[property][prop] = source[property][prop];
	   	 			 } else {
	   	 			 	destination[property] = source[property];
	   	 			 }
	   	 		}
	   			return destination;
	   		},
        _parseTxt = function(){
              if(typeof _text == 'string')
                   return _options.template.replace('[text]',_text);
              var i,
                  template = _options.template;
              for(var prop in _text)
                   template=template.replace('[' + prop + ']',_text[prop]);
              
              return template;
              
         },
         _options = _mergeOptions({
        	 				trackMouse:false,
        	 				lockTo: 'top-right',
                            showOn: 'mouseover',
                            showDelay:1,
                            hideOn: 'mouseout',
                            hideDelay:1,
                            template: "<div class='tipBox'>[text]</div>"},options),
         _position = function(){
        	if(_options.trackMouse){
        		
        	} else {
        		//get y position
        		if(_options.lockTo.indexOf('top')!=-1)
        			_tipBox.style.top = _target.offsetTop - _tipBox.offsetHeight + "px";
        		else if(_options.lockTo.indexOf('bottom')!=-1)
        			_tipBox.style.top = _target.offsetTop + _target.offsetHeight + "px";
        		else
        			_tipBox.style.top = _target.offsetTop - ((_tipBox.offsetHeight-_target.offsetHeight)/2) + "px";
        		
        		//get x position
        		if(_options.lockTo.indexOf('left')!=-1)
        			_tipBox.style.left = _target.offsetLeft - _tipBox.offsetWidth + "px";
        		else if(_options.lockTo.indexOf('right')!=-1)
        			_tipBox.style.left = _target.offsetLeft + _target.offsetWidth + "px";
        		else
        			_tipBox.style.left = _target.offsetLeft - ((_tipBox.offsetWidth-_target.offsetWidth)/2) + "px";
        	}
         },
         _draw = function(){
        	_tipBox = document.createElement('div');
          	_tipBox.innerHTML = _parseTxt();
          	_tipBox.style.position = 'absolute';
            	_target.parentNode.insertBefore(_tipBox,_target.nextSibling);
            	_position();
            if(_tipBox.addEventListener){
            	_tipBox.addEventListener('mouseover',function(e){window.clearTimeout(_hideTimer);},false);
            	_tipBox.addEventListener('mouseout',hide,false);
            } else {
            	_tipBox.attachEvent('mouseover',function(e){window.clearTimeout(_hideTimer);},false);
            	_tipBox.attachEvent('mouseout',hide);
            }
            _visible = true;
         },
         _remove = function(){
        	 _target.parentNode.removeChild(_target.nextSibling);
        	 _tipBox = null;
        	 _visible = false;
         },
         show = function(){
        	if(!_visible)
               	_showTimer = setTimeout(_draw,_options.showDelay*1000);
        	else
        		window.clearTimeout(_hideTimer);
         },
         hide = function(){
        	 if(_visible)
        		 _hideTimer = setTimeout(_remove,_options.hideDelay*1000);
        	 else
        		 window.clearTimeout(_showTimer);
         };
      if(_target.addEventListener){          
        _target.addEventListener(_options.showOn, show,false);
 		_target.addEventListener(_options.hideOn, hide,false);
      } else {
    	_target.attachEvent(_options.showOn, show);
   		_target.attachEvent(_options.hideOn, hide);  
      }

return {
    show:show,
    hide:hide
}
});