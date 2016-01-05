import Vue from 'vue';

var lu = {
	init : false
}

var luna = {
	csshandle( obj , handles ){
		if( typeof obj === 'undefined' ){
			return;
		}
		for( var name in obj ){
			if( typeof handles[name] !== 'undefined'){
				handles[name](obj[name]);
			}
		}
	},
	px2rem(px){
		return hotcss.px2rem(parseInt(px)) + 'rem';
	}
};

luna.start = (el) => {
	if( lu.init === true ){
		console.log('luna已经启动，不能重复start');
	}else{
		lu.init = true;
		luna.vm = new Vue({
			el : el || 'body'
		})
	}
}

window.luna = luna;

/*window.luna = new Vue({
	el : '#app'
});*/