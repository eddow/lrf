<template>
	<div class="centered">
		<s-input fluid class="right command">
			<input slot="input"ref="link" type="text" readonly :value="groupLink" @focus="selectLink"/>
			<s-button slot="append" icon="clipboard" @click="copy" />
		</s-input>
		<s-button icon="close" @click="quitGroup" fluid>{{'Sortir du groupe'|translate}}</s-button>
		<div>{{'Commandes en élaboration'|translate}}: {{running}}</div>
		<div>
			{{'Commandes effectuées'|translate}}:
			<ul><li v-for="(effected, index) in effecteds" :key="index">{{effected}}</li></ul>
		</div>
		<s-button v-if="isClosed" class="huge closedSign" fluid @click="()=>{}">{{timeTable}}</s-button>
		<s-button v-else icon="food" class="massive" positive @click="order" fluid red>{{'Commander'|translate}} !</s-button>
		<s-button icon="trash" negative @click="delGroup" fluid red>{{'Supprimer le groupe'|translate}}</s-button>
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
import open from 'biz/opening'
import {hours} from 'config'

@Component
export default class Group extends Vue {
	get isClosed() { return !open.opened; }
	@Getter groupLink
	@Action leaveGroup
	running: number = 0
	effecteds: string[] = []
	delGroup() {
	}
	order() {
	}
	quitGroup() {
		this.leaveGroup();
		this.$router.push({name: 'food'});
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