<template>
	<div v-if="!menus">
		Chargement...
	</div>
	<div v-else class="ui five column grid">
		<div v-for="(cdenom, ccode) in categories" :key="ccode" class="ui column">
			<div class="ui message">{{cdenom}}</div>
			<menu-edit @change="save(ccode)" dnd-group="categories" :dishById="dishes" :dishes="menus[ccode].dishes" />
		</div>
		<div class="ui column">
			<menu-edit dnd-group="categories" :dishById="dishes" :dishes="remaining" />
		</div>
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import Menu, {Categories} from 'models/menu'
import {observeDeeply, bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'
import Dish, {Languages} from 'models/dish'

const menus = bindCollection('Menu');
const dishes = bindCollection('Dish');

@Component
export default class Menus extends Vue {
	categories = Categories

	dishes: {[_id: string]: Dish} = {}
	indexDishes() {
		var dishList = dishes.getAll();
		this.dishes = {};
		for(let dish of dishList)
			this.dishes[dish._id] = dish;
			this.indexMenus();
	}
	menus: {[identification: string]: Menu} = null
  created() {
		dishes.on('all', this.indexDishes); this.indexDishes();
		menus.on('all', this.indexMenus); this.indexMenus();
	}
	destroyed() {
		dishes.off('all', this.indexDishes);
		menus.off('all', this.indexMenus);
	}
	remaining = []
	indexMenus() {
		this.menus = {};
		var remaining = {};
		for(let did in this.dishes) remaining[did] = true;
		for(let menu of menus.getAll())
			if(Categories[menu.identification]) {
				this.menus[menu.identification] = menu;
				for(let did of menu.dishes)
					delete remaining[did];
			}
		for(let menu in Categories)
			if(!this.menus[menu])
				this.menus[menu] = new Menu({
					identification: menu,
					dishes: []
				});
		this.remaining = Object.keys(remaining);
	}
	save(menu) {
		if(this.menus[menu].hasChanges())
			this.menus[menu].save();
	}
}
</script>