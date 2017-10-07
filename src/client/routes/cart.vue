<template>
	<div v-if="dishes.length" class="ui items centered">
		<s-modal v-model="commandConfirm" header="Confirmer" class="commandConfirm">
			La commande sera confirmée par téléphone.
			<s-input fluid class="large" v-model="contact.name" placeholder="Prénom">
				<s-icon slot="prepend" icon="user outline" />
			</s-input>
			<s-input fluid class="large" v-model="contact.phone" placeholder="Téléphone">
				<s-icon slot="prepend" icon="phone" />
			</s-input>
			<div class="ui negative message" v-if="phoneAlert">
				Le numéro de téléphone doit être spécifé et complet
			</div>
			<s-input fluid class="large" v-model="contact.email" placeholder="E-mail">
				<s-icon slot="prepend" icon="mail" />
			</s-input>
			<s-button class="fluid" positive @click="checkContact">Confirmer!</s-button>
		</s-modal>
		<div v-for="dish in dishes" :key="dish.product._id" class="ui item">
			<div class="content">
				<div div class="description">
					{{dish.product.title.fr}}
					<span class="right floated">{{dish.product.price}}lei<span>
				</div>
				<div class="header right floated">= {{dish.product.price*dish.quantity}}lei</div>
				<div>
					<quantity v-model="dish.quantity" @input="value=> persist(dish.product._id, value)" />
					<s-button negative icon="trash" @click="remove(dish.product)" />
				</div>
			</div>
		</div>
		<div class="ui header right floated">Total = {{totalPrice}}lei</div>
		<s-button icon="food" class="massive" positive @click="order" fluid red>Commander !</s-button>
		<s-button icon="trash" negative @click="confirmEmptyCart" fluid red>Vider le panier</s-button>
	</div>
	<div v-else>
		<h1 class="centered"><router-link to="/">Votre panier est vide. Cliquez ici pour découvrir le menu.</router-link></h1>
	</div>
</template>
<style scoped>
.centered {
	max-width: 360px;
	margin-left: auto;
	margin-right: auto;
}
.commandConfirm {
	max-width: 400px;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import Dish, {Languages} from 'models/dish'
import Menu, {Categories} from 'models/menu'
import * as alertify from 'alertify'
import {dishes, status} from 'biz/daily'
import quantity from 'components/quantity.vue'
//TODO: Enter pour valider les entrées
@Component({components: {quantity}})
export default class Cart extends Vue {
	@Getter cartProducts
	@Action emptyCart
	@Action checkout
	cachedDishes = []
	get dishes() {
		if(status.loaded) {
			this.cachedDishes.length = 0;
			this.cachedDishes.push(...this.cartProducts
				.filter(p=> !!dishes[p.product])
				.map(p=> ({
					product: dishes[p.product],
					quantity: p.quantity
				}))
			);
		}
		return this.cachedDishes;
	}
	get totalPrice() {
		return this.dishes.reduce((sum, dish)=> sum + dish.product.price*dish.quantity, 0);
	}
	
	@Action addToCart
	persist(product, quantity) { 
		this.addToCart({product, quantity: Number(quantity)});
	}
	confirmEmptyCart() {
		alertify.confirm("Supprimer le contenu du panier ?", this.emptyCart);
	}
	remove(dish) {
		alertify.confirm(`Supprimer "${dish.title.fr}" ?`, ()=> {
			this.addToCart({product: dish._id, quantity: false})
		});
	}
	commandConfirm
	contact = {
		name: "",
		phone: "",
		email: ""
	}
	phoneAlert: boolean = false
	checkContact() {
		this.phoneAlert = 10> this.contact.phone.match(/\d/g).length;
		if(!this.phoneAlert) this.commandConfirm('ok');
	}
	order() {
		this.commandConfirm(()=> {
			this.checkout(this.contact);
		});
	}
}
</script>