<template>
	<div class="ui segments">
		<s-modal v-model="chooseQtt" :header="commandItem && commandItem.title.fr" class="commandNumber">
			<quantity v-model="commandNumber" />
			{{commandItem && commandItem.description.fr}}
			<s-button class="fluid" positive v-command:ok="commandNumber">Ajouter!</s-button>
			<s-button class="fluid" v-command:cancel>Annuler</s-button>
		</s-modal>
		<div v-for="(menu, mndx) in menus" :key="mndx"
			v-if="menu.dishes.length"
			class="ui segment"
		>
			<div class="ui attached message">
				<div class="header">
					{{menu.title}}
				</div>
			</div>
			<div class="ui bottom attached relaxed divided cards">
				<div
					v-for="(dish, dndx) in menu.dishes" :key="dndx"
					class="card dimmable"
				>
				
					<s-dimmer on="hover">
						<div class="content" @click="addClick(dish)">
							<div class="center">
								<h2 class="ui inverted icon header">
									<!--icon v-if="icon" :icon="icon" /-->
									Ajouter au panier
								</h2>
							</div>
						</div>
					</s-dimmer>

					<div class="ui image">
						<div v-if="dish.today" class="ui orange right ribbon label">Aujourd'hui</div>
						<img class="middle aligned" v-if="dish.picture" :src="'picture/'+dish._id"></i>
					</div>
					<div class="content">
						<div class="header">
							{{dish.title.fr}}
							<div class="right floated">{{dish.price.toFixed(2)}} lei</div>
						</div>
						<div class="description">
							{{dish.description.fr}}
							<div class="right floated">{{(dish.grams||0).toFixed(0)}}gr</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.card.dimmed .dimmer {
	cursor: pointer;
}
.commandNumber {
	max-width: 400px;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import Dish, {Languages} from 'models/dish'
import Menu, {Categories} from 'models/menu'
import {menus} from 'biz/daily'
import quantity from 'components/quantity.vue'

@Component({components: {quantity}})
export default class Food extends Vue {
	categories = Categories
	menus = menus
	commandItem: Dish = null
	commandNumber: number = 0
	chooseQtt
	@Action addToCart
	addClick(dish) {
		this.commandItem = dish;
		this.commandNumber = 1;
		this.chooseQtt((ok, x)=> {
			this.addToCart({product: this.commandItem._id, quantity: this.commandNumber});
		});
	}
}
</script>