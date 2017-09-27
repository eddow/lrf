<template>

	<div class="ui stackable grid">
		<s-table
			class="four wide column"
			celled
			:rows="dishes"
			striped
			selectable
			:current="selected"
			@row-click="select"
		>
			<div slot="header">
				<s-button @click="addOne" icon="add circle">Ajouter</s-button>
			</div>
			
			<s-column v-for="(ldenom, lcode) in languages" :key="lcode" :prop="'title.'+lcode" :header="ldenom" />
		</s-table>
		<s-form class="twelve wide column" :model="selected" label-width="120px">
			<template scope="scope">
				<div class="ui stackable grid">
					<div class="ten wide column">
						<div v-for="(ldenom, lcode) in languages" :key="lcode">
							<div class="field ui segments">
								<s-input class="ui segment labeled" v-model="scope.model.title[lcode]">
									<label slot="prepend" class="ui label">
										{{ldenom}}
									</label>
								</s-input>
								<textarea class="ui input segment" rows="4" v-model="scope.model.description[lcode]" />
							</div>
						</div>
					</div>
					<div class="six wide column">
						<s-field prop="price" label="Prix" inline />
					</div>
				</div>
			</template>
		</s-form>
	</div>
</template>
<style>
.ui.segment.labeled {
	padding: 0;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Dish, {Languages} from 'models/dish'
import {store} from 'common/central'
import {bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'
import {observeDeeply} from 'biz/js-data'

const dishes = bindCollection('Dish');
@Component
export default class Edit extends Vue {
	dishes: Dish[] = null
	
	languages: any = Languages
	selected: Dish = null
	filters: any = {
		title: ''
	}
  created() { dishes.on('all', this.filter); }
	destroyed() { dishes.off('all', this.filter); }
	@Watch('filters', {deep: true, immediate: true})
	@Watch('$access', {deep: true})
	filter() {
		this.dishes = dishes.getAll();
		// ?
	}
	select(dish) {
		this.selected = dish;
	}
	delDish(dish, doer, cancel) {
		if(dish._id) {
			alertify.confirm(`Effacer "${dish.title.fr}" ?`, ()=> {
				dish.destroy();
				doer();
			});
			cancel();
		}
	}
	addOne() {
		this.selected = observeDeeply(new Dish({
			title: {fr: '', en: '', ro: ''},
			description: {fr: '', en: '', ro: ''},
			picture: ''
		}), Dish.schema);
		//this.selected.editing = true;
	}
}
</script>