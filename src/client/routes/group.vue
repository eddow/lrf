<template>
	<div v-if="commandGroup" class="centered">
		<s-modal v-model="commandConfirm" :header="$t('Confirmer')" class="commandConfirm">
			<contact v-model="contact" :confirm="commandConfirm" />
		</s-modal>
		<h1>{{commandGroup}}</h1>
		<s-input fluid class="right command">
			<input slot="input"ref="link" type="text" readonly :value="groupLink" @focus="selectLink"/>
			<s-button slot="append" icon="clipboard" @click="copy">{{'Copier'|translate}}</s-button>
			<s-button slot="prepend" icon="close" negative @click="quitGroup">{{'Sortir'|translate}}</s-button>
		</s-input>
		<!--div>{{'Connexions au groupe'|translate}}: {{nrConnected}}</div-->
		<div>
			{{'Commandes effectuées'|translate}}:
			<ul><li v-for="(command, index) in commands" :key="index">{{command}}</li></ul>
		</div>
		<s-button v-if="isClosed" class="huge closedSign" fluid @click="()=>{}">{{timeTable}}</s-button>
		<s-button v-else icon="food" class="massive" positive @click="order" fluid red>{{'Commander'|translate}} !</s-button>
		<s-button icon="trash" negative @click="delGroup" fluid red>{{'Supprimer le groupe'|translate}}</s-button>
	</div>
	<div v-else>
		<router-link to="/">
			<h1 class="centered">{{'Il n\'y a plus de groupe de commande.'|translate}}</h1>
			<h2 class="centered">{{'Cliquez ici pour découvrir le menu.'|translate}}</h2>
		</router-link>
	</div>
</template>
<style scoped>
.centered {
	max-width: 720px;
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
import open from 'biz/opening'
import {hours} from 'config'
import contact from 'components/contact.vue'

@Component({components: {contact}})
export default class Group extends Vue {
	get isClosed() { return !open.opened; }
	@Getter groupLink
	@Getter commandGroup
	//@Getter nrConnected
	@Getter commands
	@Action leaveGroup
	@Action deleteGroup
	@Action groupCheckout
	delGroup() {
		alertify.confirm('Êtes-vous sûr de vouloir annuler toutes les commandes du groupe de manière irréversible ?',
			this.deleteGroup());
	}
	contact = null
	order() {
		this.commandConfirm(()=> {
			this.groupCheckout({language: this.$lang, ...this.contact});
		});
	}
	quitGroup() {
		alertify.confirm('Êtes-vous sûr de ne pas vouloir commander avec le groupe ?', ()=> {
			this.leaveGroup();
			this.$router.push({name: 'food'});
		});
	}
	selectLink() {
		this.$refs.link.setSelectionRange(0, this.groupLink.length)
	}
	
	get timeTable() {
		return this.$t('Heures d\'ouverture')+`: ${hours.open}-${hours.close}`;
	}
	copy() {
		this.$refs.link.focus();
		setTimeout(()=> document.execCommand("copy"));
	}
}
</script>