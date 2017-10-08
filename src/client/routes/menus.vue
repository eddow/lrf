<template>
	<div v-if="!menus">
		Chargement...
	</div>
	<div v-else class="ui segments">
		<div class="segment ui five column grid">
			<div v-for="(pdenom, pcode) in parts" :key="pcode" class="ui column">
				<h1 class="ui header">{{pdenom}}</h1>
			</div>
		</div>
		<day-edit class="remaining segment" :dishById="dishes" :dishes="remaining" />
		<s-accordion :exclusive="false" :styled="false" class="segment">
			<s-panel v-for="(cdenom, ccode) in categories" :key="ccode" :title="cdenom">
				<day-edit
					:dishById="dishes" :dishes="menus[ccode].dishes"
					@change="save(ccode)"
				/>
			</s-panel>
		</s-accordion>
	</div>
</template>
<style>
.accordion .title {
	border-top: 1px solid black;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import Dish, {Languages, Parts} from 'models/dish'
import Menu, {Categories} from 'models/menu'
import {observeDeeply, bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'

const menus = bindCollection('menu');
const dishes = bindCollection('dish');

import DayEdit from 'components/day-edit.vue'

@Component({components: {DayEdit}})
export default class Menus extends Vue {
	categories = Categories
	parts = Parts

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