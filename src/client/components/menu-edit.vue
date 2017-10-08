<template>
	<draggable
		v-model="dishClone"
		class="ui divided list"
		:options="dndOptions"
	>
		<div class="item" v-for="dishId in dishClone" :key="dishId">			
			<div v-if="dishById[dishId]" class="content">
				<div class="header">{{dishById[dishId].title[$lang]}}</div>
				<div class="description">{{dishById[dishId].description[$lang]}}</div>
			</div>
			<div v-else class="content">
				<div class="ui negative message">Plat fantôme</div>
			</div>
		</div>
	</draggable>
</template>
<style>
.ui.divided.list {
	min-height: 64px;
	overflow-y: auto;
	max-height: 300px;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'

@Component
export default class MenuEdit extends Vue {
	@Prop() dndGroup: string
	@Prop() dishById: any
	@Prop() dishes: string[]
	dishClone = [];
	@Watch('dishes', {deep: true, immediate: true}) input(dishes) { this.dishClone = dishes; }
	@Watch('dishClone', {deep: true})
	@Emit()
	change(dishes) {
		if(dishes.length === this.dishes.length) {
			let i;
			for(i = 0; i < dishes.length; ++i)
				if(dishes[i] !== this.dishes[i])
					break;
			if(i >= dishes.length) return false;
		}
		this.dishes.length = 0;
		this.dishes.push(...dishes);
	}
	get dndOptions() {
		var rv = {draggable:'.item'};
		if(this.dndGroup) rv.group = {
			name: this.dndGroup,
			pull: true, put: true
		}
		return rv;
	}
}
</script>