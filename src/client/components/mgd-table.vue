<template>
	<s-table
		celled
		:rows="list"
		striped
		selectable
		:current="selected"
		@row-click="select"
	>
		<div slot="header">
			<s-button @click="addOne" icon="add circle" v-if="canAdd">Ajouter</s-button>
			<s-button @click="saveOne" primary icon="save" v-if="hasChanged()">Sauver</s-button>
			<s-button @click="cancelOne" secondary icon="remove circle" v-if="hasChanged()">Annuler</s-button>
			<s-button @click="delOne" negative icon="trash" v-if="canDel">Supprimer</s-button>
		</div>
		<slot />
	</s-table>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import {observeDeeply, bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'


@Component
export default class MgdTable extends Vue {
	@Prop({type: Function}) filter: (item: any)=> boolean
	@Prop({type: Function, required: true}) newEmpty: (cb?)=> any
	@Prop({type: Function, required: true}) recordClass
	@Prop({required: true}) collectionName: string

	@Model('select') selected: any

	collection	//uninitialized because unwatched
	list: any[] = []
  created() {
		this.collection = bindCollection(this.collectionName);
		this.collection.on('all', this.filterDo);
		this.filterDo();
	}
	destroyed() { this.collection.off('all', this.filterDo); }
	@Watch('filter')
	filterDo() {
		var all = this.collection.getAll();
		this.list = this.filter ? all.filter(this.filter) : all;
	}
	
	@Emit() select(item) {}
	catch(err) {
		if(err.errors) {
			alertify.alert(err.errors.map(x=> `${x.path}(${x.actual}) : ${x.expected}`).join('<br />'));
		} else alertify.alert('bug...');
	}
	get canAdd() {
		return !this.selected || this.selected._id;
	}
	addOne() {
		var rv = this.newEmpty(v=> {
			this.list.push(v);
			this.select(v);
		});
		if(!rv) this.select(rv);
	}
	hasChanged() {
		return this.selected && (!this.selected._id || this.selected.hasChanges());
	}
	saveOne() {
		try {
			var item = this.selected;
			if(!(item instanceof this.recordClass))
				item = observeDeeply(new this.recordClass(item), this.recordClass.schema);
			item.save().catch(this.catch);
		} catch(err) { this.catch(err); }
	}
	get canDel() {
		return this.selected && this.selected._id;
	}
	delOne() {
		alertify.confirm(`Effacer "${this.selected.toString()}" ?`, ()=> {
			this.selected.destroy();
		});
	}
	cancelOne() {
		var item = this.selected;
		alertify.confirm(`Annuler les modifications ?`, ()=> {
			if(item.revert) {
				item.revert();
			} else {
				let ndx = this.list.indexOf(this.selected);
				this.select(null);
				if(~ndx) this.list.splice(ndx, 1);
			}
		});
	}
}
</script>