YUI.add("scrollview-base",function(B){var C=B.ClassNameManager.getClassName,J="scrollview",G={vertical:C(J,"vert"),horizontal:C(J,"horiz")},O="scrollEnd",K="flick",F=K,D="ui",H="scrollY",I="scrollX",M="bounce",Q="x",P="y",L="boundingBox",N="contentBox",A=B.Transition.useNative;B.Node.DOM_EVENTS.DOMSubtreeModified=true;function E(){E.superclass.constructor.apply(this,arguments);}B.ScrollView=B.extend(E,B.Widget,{initializer:function(){this._createEvents();this._cb=this.get(N);this._bb=this.get(L);},_createEvents:function(){this.publish(O);this.publish(K);},_uiSizeCB:function(){},_transitionEnded:function(){if(!this._transitionsHack){this._transitionsHack=true;this.fire(O);}},bindUI:function(){var R=this._cb,S=this.get(F);this._bb.on("gesturemovestart",B.bind(this._onGestureMoveStart,this));R.on("transition:end",B.bind(this._transitionEnded,this),false);if(A){R.on("DOMSubtreeModified",B.bind(this._uiDimensionsChange,this));}if(S){R.on("flick",B.bind(this._flick,this),S);}this.after({"scrollYChange":this._afterScrollYChange,"scrollXChange":this._afterScrollXChange,"heightChange":this._afterHeightChange,"widthChange":this._afterWidthChange,"renderedChange":function(){B.later(0,this,"_uiDimensionsChange");}});},syncUI:function(){this.scrollTo(this.get(I),this.get(H));},scrollTo:function(a,Z,V,Y){var U=this._cb,W=(a!==null),T=(Z!==null),S=(W)?a*-1:0,R=(T)?Z*-1:0,X;V=V||0;Y=Y||E.EASING;if(W){this.set(I,a,{src:D});}if(T){this.set(H,Z,{src:D});}X={easing:Y,duration:V/1000};if(A){X.transform="translate("+S+"px,"+R+"px)";}else{if(W){X.left=S+"px";}if(T){X.top=R+"px";}}this._transitionsHack=false;U.transition(X);},_onGestureMoveStart:function(R){R.preventDefault();this._killTimer();var S=this._bb;this._moveEvt=S.on("gesturemove",B.bind(this._onGestureMove,this));this._moveEndEvt=S.on("gesturemoveend",B.bind(this._onGestureMoveEnd,this));this._moveStartY=R.clientY+this.get(H);this._moveStartX=R.clientX+this.get(I);this._moveStartTime=(new Date()).getTime();this._moveStartClientY=R.clientY;this._moveStartClientX=R.clientX;this._isDragging=false;this._snapToEdge=false;},_onGestureMove:function(R){R.preventDefault();this._isDragging=true;this._moveEndClientY=R.clientY;this._moveEndClientX=R.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set(H,-(R.clientY-this._moveStartY));}if(this._scrollsHorizontal){this.set(I,-(R.clientX-this._moveStartX));}},_onGestureMoveEnd:function(W){W.preventDefault();var Y=this._minScrollY,U=this._maxScrollY,R=this._minScrollX,V=this._maxScrollX,T=this._scrollsVertical?this._moveStartClientY:this._moveStartClientX,S=this._scrollsVertical?this._moveEndClientY:this._moveEndClientX,X=T-S;this._moveEvt.detach();this._moveEndEvt.detach();this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(X)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=X>0;}if(this._scrollsVertical&&Math.abs(X)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=X>0;}if(this._scrollsVertical&&this.get(H)<Y){this._snapToEdge=true;this.set(H,Y);}if(this._scrollsHorizontal&&this.get(I)<R){this._snapToEdge=true;this.set(I,R);}if(this.get(H)>U){this._snapToEdge=true;this.set(H,U);}if(this.get(I)>V){this._snapToEdge=true;this.set(I,V);}if(this._snapToEdge){return;}this.fire(O,{onGestureMoveEnd:true});return;},_afterScrollYChange:function(R){if(R.src!==D){this._uiScrollY(R.newVal,R.duration,R.easing);}},_uiScrollY:function(S,R,T){R=R||this._snapToEdge?400:0;T=T||this._snapToEdge?E.SNAP_EASING:null;this.scrollTo(null,S,R,T);},_afterScrollXChange:function(R){if(R.src!==D){this._uiScrollX(R.newVal,R.duration,R.easing);}},_uiScrollX:function(S,R,T){R=R||this._snapToEdge?400:0;T=T||this._snapToEdge?E.SNAP_EASING:null;this.scrollTo(S,null,R,T);},_afterHeightChange:function(){this._uiDimensionsChange();},_afterWidthChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var V=this._bb,R=this.get("height"),U=this.get("width"),T=V.get("scrollHeight"),S=V.get("scrollWidth");if(R&&T>R){this._scrollsVertical=true;this._maxScrollY=T-R;this._minScrollY=0;this._scrollHeight=T;V.addClass(E.CLASS_NAMES.vertical);}if(U&&S>U){this._scrollsHorizontal=true;this._maxScrollX=S-U;this._minScrollX=0;this._scrollWidth=S;V.addClass(E.CLASS_NAMES.horizontal);}},_flick:function(S){var R=S.flick;this._currentVelocity=R.velocity;this._flicking=true;this._decelCached=this.get("deceleration");this._bounceCached=this.get("bounce");this._flickFrame();this.fire(K);},_flickFrame:function(){var b,S,V,R,T,W,Z=this._scrollsVertical,Y=this._scrollsHorizontal,X=this._decelCached,a=this._bounceCached,U=E.FRAME_STEP;if(Z){S=this._maxScrollY;V=this._minScrollY;b=this.get(H)-(this._currentVelocity*U);}if(Y){T=this._maxScrollX;W=this._minScrollX;R=this.get(I)-(this._currentVelocity*U);}this._currentVelocity=(this._currentVelocity*X);if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(Z){if(b<V){this._snapToEdge=true;this.set(H,V);}else{if(b>S){this._snapToEdge=true;this.set(H,S);}}}if(Y){if(R<W){this._snapToEdge=true;this.set(I,W);}else{if(R>T){this._snapToEdge=true;this.set(I,T);}}}return;}if(Z){if(b<V||b>S){this._exceededYBoundary=true;this._currentVelocity*=a;}this.set(H,b);}if(Y){if(R<W||R>T){this._exceededXBoundary=true;this._currentVelocity*=a;}this.set(I,R);}if(!this._flickTimer){this._flickTimer=B.later(U,this,"_flickFrame",null,true);}},_killTimer:function(R){if(this._flickTimer){this._flickTimer.cancel();this._flickTimer=null;}if(R){this.fire(O);}},_setScroll:function(X,W){var T=this._cachedBounce||this.get(M),S=E.BOUNCE_RANGE,V=(W==Q)?this._maxScrollX:this._maxScrollY,U=T?-S:0,R=T?V+S:V;if(!T||!this._isDragging){if(X<U){X=U;}else{if(X>R){X=R;}}}return X;},_setScrollX:function(R){return this._setScroll(R,Q);},_setScrollY:function(R){return this._setScroll(R,P);}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.93},bounce:{value:0.1},flick:{value:{minDistance:10,minVelocity:0.3}}},CLASS_NAMES:G,UI_SRC:D,BOUNCE_RANGE:150,FRAME_STEP:30,EASING:"cubic-bezier(0, 0.1, 0, 1.0)",SNAP_EASING:"ease-out"});
},"@VERSION@",{skinnable:true,requires:["widget","event-gestures","transition"]});