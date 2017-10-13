<template>
	<form v-if="group" onsubmit="return false">
		<div class="ui attached warning message">
			{{'Commande de groupe'|translate}}: {{group}}
		</div>
		<s-input fluid class="large" v-model="contact.name" :placeholder="$t('Prénom')">
			<s-icon slot="prepend" icon="user outline" />
		</s-input>
		<div class="ui negative bottom attached message" v-if="nameAlert">
			{{'Vous devez spécifier un nom ou un pseudonyme'|translate}}
		</div>
		<s-button fluid positive @click="checkName" native-type="submit">{{'Confirmer'|translate}} !</s-button>
		<s-button fluid icon="close" v-command:cancel>{{'Attendez'|translate}}...</s-button>
	</form>
	<form v-else onsubmit="return false">
		<div class="ui attached warning message">
			{{'La commande sera confirmée par téléphone.'|translate}}
		</div>
		<s-input fluid class="large" v-model="contact.name" :placeholder="$t('Prénom')">
			<s-icon slot="prepend" icon="user outline" />
		</s-input>
		<s-input fluid class="large" v-model="contact.phone" :placeholder="$t('Téléphone')" type="tel">
			<s-icon slot="prepend" icon="phone" />
		</s-input>
		<div class="ui negative bottom attached message" v-if="phoneAlert">
			{{'Le numéro de téléphone doit être spécifé et complet'|translate}}
		</div>
		<s-input fluid class="large" v-model="contact.email" placeholder="E-mail" type="email">
			<s-icon slot="prepend" icon="mail" />
		</s-input>
		<s-input fluid class="large" v-model="contact.address" :placeholder="$t('Addresse de livraison')">
			<s-icon slot="prepend" icon="marker" />
		</s-input>
		<s-button fluid positive @click="checkContact" native-type="submit">{{'Confirmer'|translate}} !</s-button>
		<s-button fluid icon="close" v-command:cancel>{{'Attendez'|translate}}...</s-button>
	</form>
</template>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'

@Component
export default class Contact extends Vue {
	@Prop({default: '', type: [Boolean, String]}) group: string
	@Model('loaded') given: any
	@Prop({type: Function}) confirm
	contact = null
	
	created() {
		var cookie = this.cookies.getItem('orderContact');
		this.$emit('loaded', this.contact = {
			name: "",
			phone: "",
			email: "",
			address: "",
			...cookie ? JSON.parse(cookie) : {}
		});
	}
	@Watch('given') setContact(value) {
		this.contact = value;
	}
	phoneAlert: boolean = false
	checkContact() {
		var figures = this.contact.phone.match(/\d/g);
		this.phoneAlert = !figures || 10> figures.length;
		if(!this.phoneAlert) {
			this.cookies.setItem('orderContact', JSON.stringify(this.contact));
			this.confirm('ok');
		}
	}
	nameAlert: boolean = false
	checkName() {
		this.nameAlert = !this.contact.name;
		if(!this.nameAlert) {
			this.cookies.setItem('orderContact', JSON.stringify(this.contact));
			this.confirm('ok');
		}
	}
}
</script>
