<template>
	<div v-if="dishes.length" class="ui items centered">
		<s-modal v-model="commandConfirm" :header="$t('Confirmer')" class="commandConfirm">
			<form onsubmit="return false">
				{{'La commande sera confirmée par téléphone.'|translate}}
				<!--s-input fluid class="large" v-model="contact.time" :placeholder="$t('Heure de livraison')" type="time" :min="minTime">
					<s-icon slot="prepend" icon="hourglass end" />
				</s-input-->
				<s-input fluid class="large" v-model="contact.name" :placeholder="$t('Prénom')">
					<s-icon slot="prepend" icon="user outline" />
				</s-input>
				<s-input fluid class="large" v-model="contact.phone" :placeholder="$t('Téléphone')" type="tel">
					<s-icon slot="prepend" icon="phone" />
				</s-input>
				<div class="ui negative message" v-if="phoneAlert">
					{{'Le numéro de téléphone doit être spécifé et complet'|translate}}
				</div>
				<s-input fluid class="large" v-model="contact.email" placeholder="E-mail" type="email">
					<s-icon slot="prepend" icon="mail" />
				</s-input>
				<s-button class="fluid" positive @click="checkContact" native-type="submit">{{'Confirmer'|translate}} !</s-button>
			</form>
		</s-modal>
		<div v-for="dish in dishes" :key="dish.product._id" class="ui item">
			<div class="content">
				<div div class="description">
					{{dish.product.title[$lang]}}
					<span class="right floated">{{dish.product.price}}lei<span>
				</div>
				<div class="header right floated">= {{dish.product.price*dish.quantity}}lei</div>
				<div>
					<s-button negative icon="trash" @click="remove(dish.product)" />
					<quantity v-model="dish.quantity" @input="value=> persist(dish.product._id, value)" />
				</div>
			</div>
		</div>
		<div class="ui header right floated">{{'Total'|translate}} = {{totalPrice}}lei</div>
		<s-button icon="food" class="massive" positive @click="order" fluid red>{{'Commander'|translate}} !</s-button>
		<s-button icon="trash" negative @click="confirmEmptyCart" fluid red>{{'Vider le panier'|translate}}</s-button>
	</div>
	<div v-else>
		<h1 class="centered"><router-link to="/">{{'Votre panier est vide. Cliquez ici pour découvrir le menu.'|translate}}</router-link></h1>
	</div>
</template>
<style scoped>
.centered {
	max-width: 360px;
	margin-left: auto;
	margin-right: auto;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import * as alertify from 'alertify'
import {dishes, status} from 'biz/daily'
import quantity from 'components/quantity.vue'

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
		alertify.confirm(this.$t('Supprimer le contenu du panier')+' ?', ()=> {
			this.emptyCart();
			this.$router.push({name: 'food'});
		});
	}
	remove(dish) {
		alertify.confirm(this.$t('Enlever')+` "${dish.title[this.$lang]}" ?`, ()=> {
			this.addToCart({product: dish._id, quantity: false})
		});
	}
	commandConfirm
	contact = {
		name: "",
		phone: "",
		email: "",
		time: ""
	}
	get minTime() {
		var dt = new Date((new Date()).getTime()+65*60*1000),	//65 minutes
			minutes = dt.getMinutes();
		return dt.getHours()+':'+(10> minutes?'0': '')+minutes+':00';
	}
	phoneAlert: boolean = false
	checkContact() {
		var figures = this.contact.phone.match(/\d/g);
		this.phoneAlert = !figures || 10> figures.length;
		if(!this.phoneAlert) this.commandConfirm('ok');
	}
	order() {
		this.commandConfirm(()=> {
			this.checkout({language: this.$lang, ...this.contact});
		});
	}
}
</script>