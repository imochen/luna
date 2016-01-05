<style scoped lang="sass">
	@import '../../px2rem';
	div[{{name}}]{

	}
</style>
<template>
	<div {{name}}>
		
	</div>
</template>
<script>
	export default{
		props : { //接收的属性值

		},
		compiled(){ //解析完成，此时未必已经插入到DOM中，但可以操作DOM对象。

		},
		ready(){ //插入到DOM完成

		}

	}
</script>