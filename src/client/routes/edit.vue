<template>

	<div class="ui stackable grid">
		<div class="four wide column">
			<s-table
				style="width: 100%;"
				celled
				:rows="dishes"
				striped
				selectable
				:current="selected"
				@row-click="select"
			>
				<div slot="header">
					<s-button @click="addOne" icon="add circle" :disabled="!canAdd">Ajouter</s-button>
					<s-button @click="saveOne" primary icon="save" :disabled="!hasChanged">Sauver</s-button>
					<s-button @click="cancelOne" secondary icon="remove circle" :disabled="!hasChanged">Annuler</s-button>
					<s-button @click="delOne" negative icon="trash" :disabled="!canDel">Supprimer</s-button>
				</div>
				
				<!--s-column v-for="(ldenom, lcode) in languages" :key="lcode" :prop="'title.'+lcode" :header="ldenom" /-->
				<s-column header="Catégorie">
					<template scope="row">
						{{categories[row.model.category]}}
					</template>
				</s-column>
				<s-column prop="title.fr" header="Titre" />
			</s-table>
		</div>
		<s-form class="twelve wide column" :model="selected" label-width="120px">
			<s-data-mold select="languages">
				<template slot="input" scope="field">
					<s-select :name="field.name" v-model="field.value">
						<s-option
							v-for="(txt, val) in categories" :key="val"
							:value="val"
							:text="txt"
						>
					</s-select>
				</template>
				<template slot="display" scope="field">
					{{categories[field.value]}}
				</template>
			</s-data-mold>
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
						<s-field prop="price" label="Prix" inline 
							:input="number"
							:output="x=> ''+ x"
						/>
						<s-field prop="category" label="Catégorie" inline>
							<template slot="input" scope="field">
								<s-select :name="field.name" v-model="field.value">
									<s-option
										v-for="(txt, val) in categories" :key="val"
										:value="val"
										:text="txt"
									>
								</s-select>
							</template>
						</s-field>
						<vue-clip :options="optUpload" v-show="selected && selected._id" :on-sending="upload">
							<template slot="clip-uploader-action" scope="params">
								<div :class="['dz-message', params.dragging && 'is-dragging']">
									<img class="ui image" v-if="selected.pictureUrl" :src="selected.pictureUrl" />
									<s-icon v-else icon="huge cloud upload" />
								</div>
							</template>
						</vue-clip>
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
.dz-message {
	padding: 70px;
	border: 1px blue dashed;
	background-color: white;
	z-index: 1;
	text-align: center;
}
.is-dragging {
	border-style: solid;
	background-color: lightblue;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Dish, {Languages, Categories} from 'models/dish'
import {store} from 'common/central'
import {bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'
import {observeDeeply} from 'biz/js-data'

const dishes = bindCollection('Dish');
@Component
export default class Edit extends Vue {
	dishes: Dish[] = null
	
	languages: any = Languages
	categories: any = Categories
	selected: Dish = null
	filters: any = {
		title: ''
	}

	get optUpload() {
		return {
			url: '/picture/'+this.selected._id,
			paramName: 'file',
			acceptedFiles: 'image/*',
			uploadMultiple: false
		};
	}
	number(string) {
		var rv = Number(string);
		if(isNaN(rv)) throw new Error('bad number');
		return rv;
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
		if(!dish.pictureUrl)
			Vue.set(dish, 'pictureUrl', dish.picture?'/picture/'+dish._id:'');
	}
	catch(err) {
		if(err.errors) {
			alertify.alert(err.errors.map(x=> `${x.path}(${x.actual}) : ${x.expected}`).join('<br />'));
		} else alertify.alert('bug...');
	}
	get canAdd() {
		return !this.selected || this.selected._id;
	}
	addOne() {
		this.selected = /*observeDeeply(new Dish(*/{
			title: {fr: '', en: '', ro: ''},
			description: {fr: '', en: '', ro: ''},
			picture: '',
			price: 0,
			category: 'archived'
		}/*), Dish.schema)*/;
		//this.selected.editing = true;
	}
	get hasChanged() {
		if(this.selected && !this.selected.pictureChanged)
			Vue.set(this.selected, 'pictureChanged', false);
		return this.selected && (!this.selected._id || this.selected.hasChanges() || this.selected.pictureChanged);
	}
	pictureAsServer(dish) {
		dish.pictureChanged = false;
		dish.pictureUrl = dish.picture?'/picture/'+dish._id:'';
	}
	saveOne() {
		try {
			var dish = this.selected;
			if(!(dish instanceof Dish))
				dish = observeDeeply(new Dish(dish), Dish.schema);
			dish.save().catch(this.catch).then(()=> {
				this.pictureAsServer(dish);
			});
		} catch(err) { this.catch(err); }
	}
	get canDel() {
		return this.selected && this.selected._id;
	}
	delOne() {
		alertify.confirm(`Effacer "${this.selected.title.fr}" ?`, ()=> {
			this.selected.destroy();
		});
	}
	cancelOne() {
		var dish = this.selected;
		alertify.confirm(`Annuler les modifications sur ce plat ?`, ()=> {
			if(dish._id) {
				dish.revert();
				this.pictureAsServer(dish);
			} else this.selected = null
		});
	}
	upload(file, xhr, formData) {
		var dish = this.selected, content = file._file;
		dish.picture = file.name;
		var reader = new FileReader();
		reader.addEventListener("load", function () {
			dish.pictureUrl = reader.result;
		}, false);
		reader.readAsDataURL(content);
		dish.pictureChanged = true;
	}
}
</script>