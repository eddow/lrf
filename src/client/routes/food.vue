<template>
	<div class="ui segments food">
		<s-modal v-model="chooseQtt" :header="commandItem && commandItem.title[$lang]" class="commandNumber">
			<form onsubmit="return false">
				<quantity v-model="commandNumber" fluid />
				<s-button class="fluid" positive v-command:ok="commandNumber" native-type="submit">{{'Ajouter'|translate}} !</s-button>
				<s-button class="fluid" v-command:cancel>{{'Annuler'|translate}}</s-button>
			</form>
		</s-modal>
		<div v-for="(menu, mndx) in menus" :key="mndx"
			v-if="menu.dishes.length"
			class="ui segment"
		>
			<div class="ui attached message">
				<div class="header">
					{{menu.title|translate}}
				</div>
			</div>
			<div class="ui bottom attached relaxed divided cards">
				<div
					v-for="(dish, dndx) in menu.dishes" :key="dndx"
					class="ui centered card dimmable"
				>
					<s-dimmer on="hover">
						<div class="content" @click="addClick(dish)">
							<div class="center">
								<h2 class="ui inverted header">
									<s-icon icon="+big shopping basket+large green add" />
									<p>{{'Ajouter au panier'|translate}}</p>
								</h2>
							</div>
						</div>
					</s-dimmer>

					<div class="ui image">
						<div v-if="dish.today" class="ui orange right ribbon label">{{'Aujourd\'hui'|translate}}</div>
						<img class="middle aligned" v-if="dish.picture" :src="'picture/'+dish._id"></i>
						<img class="middle aligned" v-else src="/logo290.png"></i>
					</div>
					<div class="content">
						<div class="header">
							{{dish.title[$lang]}}
							<div class="right floated">{{$lei(dish.price)}}</div>
						</div>
						<div class="description">
							{{dish.description[$lang]}}
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
.ui.modal.commandNumber {
	/*max-width: 400px;
	margin-left: auto !important;
	margin-right: auto !important;*/
}
.ui.food {
	max-width: 1000px;
	margin-left: auto;
	margin-right: auto;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import {Categories} from '../../common/auxs'
import {menus} from 'biz/daily'
import quantity from 'components/quantity.vue'

@Component({components: {quantity}})
export default class Food extends Vue {
	categories = Categories
	menus = menus
	commandItem = null
	commandNumber: number = 0
	chooseQtt
	@Action addToCart
	addClick(dish) {
		this.commandItem = dish;
		this.commandNumber = 1;
		this.chooseQtt((ok, x)=> {
			this.addToCart({product: this.commandItem._id, quantity: this.commandNumber, add: true});
		});
	}
}
</script>