var tipBox = {
	tip:(function(element,text,options){

	if(typeof element == 'string'){
		element = '#' + element;
	
		if(document.querySelector(element)==null)
			throw new Exception('Element ' + element + " does not exist!");
	}
	
	 var _target = (typeof element == 'string') ? document.querySelector(element): element,
	 	 _webkit = navigator.userAgent.match(/WebKit\/([\d.]+)/) ? true : false,
	 	 _gecko2 = navigator.userAgent.match(/(rv:2)(.*)(Gecko\/([\d.]+))/) ? true : false,
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
                            template: "<div class='tipBox'>[text]</div>",
                            animation:"none",
                            duration:0.5,
                            easing:'ease'
                            },options),
         _position = function(e,el){
        	 var snapTo = {},
        	 	docElement = document.documentElement,
        	 	body = document.body || { scrollLeft: 0 };
        	 	
        	if(el===undefined)
        		el = _tipBox;
        	 	
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
    					'width':parseFloat(_target.style.width) || _target.offsetWidth,
    					'height':parseFloat(_target.style.height) || _target.offsetHeight
    				};
        	
        		//get y position
        		if(_options.position.indexOf('top')!=-1)
        			el.style.top = snapTo.top - (parseFloat(el.style.height) || el.offsetHeight) + "px";
        		else if(_options.position.indexOf('bottom')!=-1)
        			el.style.top = snapTo.top + snapTo.height + "px";
        		else
        			el.style.top = snapTo.top - (((parseFloat(el.style.height) || el.offsetHeight)-snapTo.height)/2) + "px";
        		
        		//get x position
        		if(_options.position.indexOf('left')!=-1)
        			el.style.left = snapTo.left - (parseFloat(el.style.width) || el.offsetWidth) + "px";
        		else if(_options.position.indexOf('right')!=-1)
        			el.style.left = snapTo.left + snapTo.width + "px";
        		else
        			el.style.left = snapTo.left - (((parseFloat(el.style.width) || el.offsetWidth)-snapTo.width)/2) + "px";
        		
        	if(_options.snapTo=='mouse'){
        		_addEvent(_target,'mousemove',_position);
        		_addEvent(el,'mousemove',_position);
        	}
         },
         _interpolate = function (source,target,pos){ 
         	return (source+(target-source)*pos).toFixed(3);
         },
         _parseProps = function (prop){
    		var p = parseFloat(prop), q = prop.replace(/^[\-\d\.]+/,'');
    		return isNaN(p) ? { v: q, f: color, u: ''} : { v: p, f: _interpolate, u: q };
  		 },
         _setUpAnimation = function(action){
         	var props,
         		testNode = _tipBox.cloneNode(true);
         	
         	testNode.visibility = 'hidden';
         	_target.parentNode.insertBefore(testNode,_target.nextSibling);
         	_position(null,testNode);
         	switch(_options.animation){
         		case 'fade':
         			props = {"opacity":(action=='show') ? '1' :'0'};
         			_tipBox.style.opacity = (action=='show') ? '0' : '1';
         			break;
         		case 'scale':
         			props = {'width':(action=='show') ? (parseFloat(testNode.style.width) || testNode.offsetWidth) + "px" : '0px',
         					'height':(action=='show') ? (parseFloat(testNode.style.height) || testNode.offsetHeight) + "px" : '0px',
         					'top': testNode.offsetTop + "px",
         					'left':testNode.offsetLeft + "px"};
         			
         			if(action=='show'){
         				_tipBox.style.width = _tipBox.style.height = '0px';
         				_tipBox.style.overflow = "hidden";
         				_tipBox.style.whiteSpace = "no-wrap";
         				_position();
         			} else {
         				testNode.style.width = testNode.style.height = '1px';
         				testNode.style.overflow = "hidden";
         				testNode.style.whiteSpace = "no-wrap";
         				_position(null,testNode);
         				props.top =	testNode.style.top || testNode.offsetTop + "px";
         				props.left = testNode.style.left || testNode.offsetLeft + "px";
         			}		
         			break;
         	}
         	_target.parentNode.removeChild(testNode);
         	return props;
         },
         _animate = function(props,callback){
         		if(_webkit || _gecko2){
      				var transitions = [], key;
    				for(key in props)
    					 transitions.push(key);
    				
    				_tipBox.style.setProperty('-' + (_webkit ? 'webkit' : 'moz') + '-transition-property',transitions.join(', '),'');
    				_tipBox.style.setProperty('-' + (_webkit ? 'webkit' : 'moz') + '-transition-duration',_options.duration + 's','');
    				_tipBox.style.setProperty('-' + (_webkit ? 'webkit' : 'moz') + '-transition-timing-function',_options.easing,'');
    				
    				for (key in props)
      					_tipBox.style[key] = props[key];
      				    				      				
       				if(callback !== undefined)
       					_addEvent(_tipBox,(_webkit ? 'webkitTransitionEnd' : 'transitionend'),callback);
       					
       			} else {
       				var start = (new Date).getTime(),
       					duration = _options.duration*1000,
       					finish = start + duration,
       					comp = _tipBox.currentStyle ? _tipBox.currentStyle : getComputedStyle(_tipBox, null),
       					current = {},
       					interval,
       					target = {};
       					for (var prop in props) target[prop] = _parseProps(props[prop]);
       					for(var prop in props) current[prop] = _parseProps(comp[prop]);
       					interval = setInterval(function(){
       						var time = (new Date).getTime(),
       							pos = time > finish ? 1 : (time-start)/duration;
       							for(var prop in target)
       								_tipBox.style[prop] = target[prop].f(current[prop].v,target[prop].v,tipBox.easing[_options.easing](pos)) + target[prop].u;
       						
      						if(time>finish){
       							clearInterval(interval);
       							if(callback !== undefined)
       								callback.call();	
       						}
       					},10);
       			}
         },
         _draw = function(e){
        	_tipBox = document.createElement('div');
          	_tipBox.innerHTML = _parseTxt();
          	_tipBox.style.position = 'absolute';
         	if(_options.animation!='none')
         		var props = _setUpAnimation('show');
         		
         	_target.parentNode.insertBefore(_tipBox,_target.nextSibling);
            _position(e);
            
            if(_options.animation!="none")
            	_animate(props);
                 	
            if(_options.hideOn=='mouseout'){
            	_addEvent(_tipBox,'mouseover',function(e){window.clearTimeout(_hideTimer)});
               	_addEvent(_tipBox,'mouseout',hide);
            }
            _visible = true;
         },
         _remove = function(){
         	if(_options.animation != 'none'){
         		var props = _setUpAnimation('hide');
         		_animate(props,function(e){if(_tipBox !== null) _target.parentNode.removeChild(_tipBox);_tipBox = null})
         	} else {
        	 	_target.parentNode.removeChild(_tipBox);
        	 	_tipBox = null;
        	 }
        	 if(_options.snapTo=='mouse')
        		 _removeEvent(_target,'mousemove',_position);
        	 
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
	},
	easing: {
		ease:function(pos) {
		    return (-Math.cos(pos*Math.PI)/2) + 0.5;
		  },
		linear: function(pos){
			return pos;
		}
	}
}

