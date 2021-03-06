<template>
	<div v-if="dishes.length" class="ui items centered">
		<s-modal v-model="commandConfirm" :header="$t('Confirmer')" class="commandConfirm">
			<contact :group="commandGroup" v-model="contact" :confirm="commandConfirm" />
		</s-modal>
		<div v-for="dish in dishes" :key="dish.product._id" class="ui item">
			<div class="content">
				<div div class="description">
					{{dish.product.title[$lang]}}
					<span class="right floated">{{$lei(dish.product.price)}}<span>
				</div>
				<div>
					<s-button negative icon="trash" @click="remove(dish.product)" />
					<quantity v-model="dish.quantity" @input="value=> persist(dish.product._id, value)" />
				</div>
				<div class="header right floated">= {{$lei(dish.product.price*dish.quantity)}}</div>
			</div>
		</div>
		<div class="ui header right floated">
			<table>
				<tr><th>{{'Total'|translate}}:</th><td>{{$lei(totalPrice)}}</td></tr>
				<template v-if="!commandGroup">
					<tr><th>{{'Livraison'|translate}}:</th><td>{{$lei(shipping)}}</td></tr>
					<tr><th>{{'À payer'|translate}}:</th><td>{{$lei(totalPrice+shipping)}}</td></tr>
				</template>
			</table>
		</div>
		<s-button v-if="isClosed" class="huge closedSign" fluid @click="()=>{}">{{timeTable}}</s-button>
		<s-button v-else icon="food" class="massive" positive @click="order" fluid red>{{'Commander'|translate}} !</s-button>
		<s-button icon="trash" negative @click="confirmEmptyCart" fluid red>{{'Vider le panier'|translate}}</s-button>
	</div>
	<div v-else>
		<router-link to="/">
			<h1 class="centered">{{'Votre panier est vide.'|translate}}</h1>
			<h2 class="centered">{{'Cliquez ici pour découvrir le menu.'|translate}}</h2>
		</router-link>
	</div>
</template>
<style scoped>
.centered {
	max-width: 360px;
	margin-left: auto;
	margin-right: auto;
}
.closedSign {
	padding: 5px;
	border: 3px double red;
	border-radius: 5px;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import * as alertify from 'alertify'
import {dishes, status} from 'biz/daily'
import quantity from 'components/quantity.vue'
import contact from 'components/contact.vue'
import open from 'biz/opening'
import {hours} from 'config'
import shipping from 'common/libs/shipping'

@Component({components: {quantity, contact}})
export default class Cart extends Vue {
	@Getter cartProducts
	@Action emptyCart
	@Action checkout
	cachedDishes = []
	get dishes() {
		if(status.loaded) {
			this.cachedDishes.length = 0;
			this.cachedDishes.push(...this.cartProducts);
		}
		return this.cachedDishes;
	}
	get isClosed() { return !open.opened; }
	get totalPrice() {
		return this.dishes.reduce((sum, dish)=> sum + dish.product.price*dish.quantity, 0);
	}
	get shipping() {
		return shipping(this.totalPrice);
	}
	
	get timeTable() {
		return this.$t('Heures d\'ouverture')+`: ${hours.open}-${hours.close}`;
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
	contact = null
	get minTime() {
		var dt = new Date((new Date()).getTime()+65*60*1000),	//65 minutes
			minutes = dt.getMinutes();
		return dt.getHours()+':'+(10> minutes?'0': '')+minutes+':00';
	}
	@Getter commandGroup
	order() {
		this.commandConfirm(()=> {
			this.checkout({language: this.$lang, ...this.contact});
		});
	}
}
</script>