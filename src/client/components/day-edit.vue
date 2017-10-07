<template>
	<div class="ui five column grid">
		<div v-for="(pdenom, pcode) in parts" :key="pcode" class="ui column">
			<menu-edit @change="value=> change(value, pcode)" :dnd-group="pcode" :dishById="dishById" :dishes="partDishes(pcode)" />
		</div>
	</div>
</template>
<style>
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import Dish, {Languages, Parts} from 'models/dish'
import MenuEdit from 'components/menu-edit.vue'

@Component({components: {MenuEdit}})
export default class DayEdit extends Vue {
	parts = Parts
	@Prop() dndGroup: string
	@Prop() dishById: any
	@Prop() dishes: string[]
	partDishes(pcode) {
		return this.dishes.filter(d=> {
			let dobj = this.dishById[d];
			return dobj && dobj.part === pcode
		});
	}
	@Emit() change(value, pcode) {
		var rv = this.dishes.filter(d=> {
			let dobj = this.dishById[d];
			return dobj && dobj.part !== pcode
		}).concat(value);
		this.dishes.length = 0;
		this.dishes.push(...rv);
	}
}
</script>