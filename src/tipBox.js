var tipBox = {
	tip:(function(element,text,options){

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
         _addEvent = function(el,event,callback){
		 	if(el.addEventListener)
		 		el.addEventListener(event,callback,false);
		 	else
		 		el.attachEvent(event,callback);
	 	 },
	 	 _removeEvent = function(el,event,callback){
	 		 if(el.removeEventListener)
	 			 el.removeEventListener(event,callback,false);
	 		 else
	 			 el.detachEvent(event,callback);
	 	 },
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
        	 				snapTo:'element',
        	 				position: 'top-right',
                            showOn: 'mouseover',
                            showDelay:1,
                            hideOn: 'mouseout',
                            hideDelay:1,
                            template: "<div class='tipBox'>[text]</div>"},options),
         _position = function(e){
        	 var snapTo = {},
        	 	docElement = document.documentElement,
        	 	body = document.body || { scrollLeft: 0 };
        	 	
        	if(_options.snapTo=='mouse')
        		snapTo = {
    					'top':e.pageY || (e.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0)),
    					'left': e.pageX || (e.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0)),
    					'width':0,
    					'height':0
    				};
           	else
        		snapTo = {
    					'top':_target.offsetTop,
    					'left': _target.offsetLeft,
    					'width':_target.offsetWidth,
    					'height':_target.offsetHeight
    				};
        	
        		//get y position
        		if(_options.position.indexOf('top')!=-1)
        			_tipBox.style.top = snapTo.top - _tipBox.offsetHeight + "px";
        		else if(_options.position.indexOf('bottom')!=-1)
        			_tipBox.style.top = snapTo.top + snapTo.height + "px";
        		else
        			_tipBox.style.top = snapTo.top - ((_tipBox.offsetHeight-snapTo.height)/2) + "px";
        		
        		//get x position
        		if(_options.position.indexOf('left')!=-1)
        			_tipBox.style.left = snapTo.left - _tipBox.offsetWidth + "px";
        		else if(_options.position.indexOf('right')!=-1)
        			_tipBox.style.left = snapTo.left + snapTo.width + "px";
        		else
        			_tipBox.style.left = snapTo.left - ((_tipBox.offsetWidth-snapTo.width)/2) + "px";
        		
        	if(_options.snapTo=='mouse'){
        		_addEvent(_target,'mousemove',_position);
        		_addEvent(_tipBox,'mousemove',_position);
        	}
         },
         _draw = function(e){
        	_tipBox = document.createElement('div');
          	_tipBox.innerHTML = _parseTxt();
          	_tipBox.style.position = 'absolute';
            	_target.parentNode.insertBefore(_tipBox,_target.nextSibling);
            	_position(e);
            if(_options.hideOn=='mouseout'){
            	_addEvent(_tipBox,'mouseover',function(e){window.clearTimeout(_hideTimer)});
               	_addEvent(_tipBox,'mouseout',hide);
            }
            _visible = true;
         },
         _remove = function(){
        	 _target.parentNode.removeChild(_target.nextSibling);
        	 if(_options.snapTo=='mouse')
        		 _removeEvent(_target,'mousemove',_position);
        	 _tipBox = null;
        	 _visible = false;
         },
         show = function(e){
        	if(!_visible)
               	_showTimer = setTimeout(_draw,_options.showDelay*1000,e);
        	else
        		window.clearTimeout(_hideTimer);
         },
         hide = function(e){
        	 if(_visible)
        		 _hideTimer = setTimeout(_remove,_options.hideDelay*1000);
        	 else
        		 window.clearTimeout(_showTimer);
         };

         
         if(_options.snapTo=='mouse')
        	 _options.hideDelay=0;
         
         _addEvent(_target,_options.showOn,show);
         _addEvent(_target,_options.hideOn,hide);

         return {
        	 show:show,
        	 hide:hide
         }
	}),
	scan: function(className,options){
		//auto magical toolbox generation
		var tips = [],
			triggers = document.querySelectorAll('.' + className), 
			tipOptions = options || {};
		for(var i= 0; i<triggers.length;i++)
			tips.push(new tipBox.tip(triggers[i],triggers[i].title,tipOptions));
	}
}

