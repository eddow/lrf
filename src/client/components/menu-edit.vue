<template>
	<div>
		<s-select v-if="!dndGroup" fluid transparent class="icon labeled button" action="hide" @change="addDish">
			<template slot="bar">
				<s-icon icon="add square" />
				<span class="text">Ajouter</span>
			</template>
			<s-option
				v-for="val in addible" :key="val"
				:value="val"
				:text="dishById[val].title.fr"
			>
			<s-icon slot="prepend" icon="search" />
		</s-select>
		<draggable
			v-model="dishClone"
			class="ui divided list"
			:options="dndOptions"
		>
			<div class="item" v-for="dishId in dishClone" :key="dishId">			
				<div v-if="dishById[dishId]" class="content">
					<div class="header">{{dishById[dishId].title.fr}}</div>
					<div class="description">{{dishById[dishId].description.fr}}</div>
				</div>
				<div v-else class="content">
					<div class="ui negative message">Plat fantôme</div>
				</div>
			</div>
		</draggable>
	</div>
</template>
<style>
.ui.divided.list {
	min-height: 100px;
}
</style>
<script lang="ts">
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

	/*
	cachedAddible: string[] = []
	get addible() {
		this.cachedAddible.length = 0;
		for(let did in this.dishes)
			if(!~this.menu.dishes.indexOf(did))
				this.cachedAddible.push(did);
		return this.cachedAddible;
	}
	addDish(value) {
		this.menu.dishes.push(value);
	}*/
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