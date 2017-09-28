<template>
	<div>
		<s-select fluid transparent class="icon labeled button" action="hide" @change="addDish">
			<template slot="bar">
				<s-icon icon="add square" />
				<span class="text">Ajouter</span>
			</template>
			<s-option
				v-for="val in addible" :key="val"
				:value="val"
				:text="dishes[val].title.fr"
			>
			<s-icon slot="prepend" icon="search" />
		</s-select>
		<draggable
			v-model="menu.dishes"
			class="ui relaxed divided list"
			:options="{draggable:'.item'}"
		>
			<div class="item" v-for="dishId in menu.dishes" :key="dishId">			
				<div v-if="dishes[dishId]" class="content">
					<div class="header">{{dishes[dishId].title.fr}}</div>
					<div class="description">{{dishes[dishId].description.fr}}</div>
				</div>
				<div v-else class="content">
					<div class="ui negative message">Plat fantôme</div>
				</div>
			</div>
		</draggable>
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Menu from 'models/menu'
import Dish, {Languages} from 'models/dish'
import {observeDeeply, bindCollection} from 'biz/js-data'
const menus = bindCollection('Menu');
const dishes = bindCollection('Dish');

@Component
export default class MenuEdit extends Vue {
	@Prop() menuId: string
	dishes: {[_id: string]: Dish} = {}
	indexDishes() {
		var dishList = dishes.getAll();
		this.dishes = {};
		for(let dish of dishList)
			this.dishes[dish._id] = dish;
	}
	menu: Menu = null
  created() {
		dishes.on('all', this.indexDishes); this.indexDishes();
		menus.on('all', this.indexMenus); this.indexMenus();
	}
	destroyed() {
		dishes.off('all', this.indexDishes);
		menus.off('all', this.indexMenus);
	}
	indexMenus() {
		var found = menus.getAll().find(menu=> menu.identification=== this.menuId);
		if(found) this.menu = found;
		else if(!this.menu) this.menu = {
			identification: this.menuId,
			dishes: []
		}
	}
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
	}
}
</script>