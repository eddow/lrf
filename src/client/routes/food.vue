<template>
	<div class="ui segments">
		<div v-for="(menu, mndx) in menus" :key="mndx" class="ui segment">
			<div class="ui attached message">
				<div class="header">
					{{menu.title}}
				</div>
			</div>
			<div class="ui bottom attached relaxed divided cards">
				<div v-for="(dish, dndx) in menu.dishes" :key="dndx" class="card">
					<div class="image">
						<img class="middle aligned" v-if="dish.picture" :src="'picture/'+dish._id"></i>
					</div>
					<div class="content">
						<div class="header">
							{{dish.title.fr}}
							<div class="right floated">{{dish.price.toFixed(2)}} lei</div>
						</div>
						<div class="description">
							{{dish.description.fr}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Dish, {Languages} from 'models/dish'
import Menu, {Categories} from 'models/menu'

var menus = [];
Vue.axios('/customer/menu').then(response=> {
	menus.push(...response.data);
});

@Component
export default class Food extends Vue {
	categories = Categories
	menus = menus
}
</script>