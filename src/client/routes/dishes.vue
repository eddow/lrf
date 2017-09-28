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
					<s-button @click="saveOne" primary icon="save" :disabled="!hasChanged()">Sauver</s-button>
					<s-button @click="cancelOne" secondary icon="remove circle" :disabled="!hasChanged()">Annuler</s-button>
					<s-button @click="delOne" negative icon="trash" :disabled="!canDel">Supprimer</s-button>
				</div>
				<s-column prop="title.fr" header="Titre" />
			</s-table>
		</div>
		<s-form class="twelve wide column" :model="selected" label-width="120px">
			<template scope="scope">
				<div class="ui stackable grid">
					<div class="six wide column">
						<s-field prop="part" label="Place" inline>
							<template slot="input" scope="field">
								<s-select :name="field.name" selection v-model="field.value">
									<s-option
										v-for="(txt, val) in parts" :key="val"
										:value="val"
										:text="txt"
									>
								</s-select>
							</template>
						</s-field>
						<s-field prop="price" label="Prix" inline 
							:input="number"
							:output="x=> ''+ x"
						/>
						<div>
							<input type="file" @change="pictureChange" accept="image/*" />
							<img class="ui image" v-if="selected.picture" :src="selected.picture" />
						</div>
					</div>
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
import Dish, {Languages, Parts} from 'models/dish'
import {observeDeeply, bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'

const dishes = bindCollection('Dish');
@Component
export default class Dishes extends Vue {
	dishes: Dish[] = null
	
	languages: any = Languages
	parts: any = Parts
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
	filter() {
		this.dishes = dishes.getAll();
		// ?
	}
	select(dish) {
		this.selected = dish;
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
			part: ''
		}/*), Dish.schema)*/;
		//this.selected.editing = true;
	}
	hasChanged() {
		return this.selected && (!this.selected._id || this.selected.hasChanges());
	}
	saveOne() {
		try {
			var dish = this.selected;
			if(!(dish instanceof Dish))
				dish = observeDeeply(new Dish(dish), Dish.schema);
			dish.save().catch(this.catch)/*.then(()=> this.$forceUpdate())*/;
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
			} else this.selected = null
		});
	}
	pictureChange(event) {
		var dish = this.selected, content = event.target.files[0];
		var reader = new FileReader();
		reader.addEventListener("load", function () {
			//dish.picture = reader.result;
			var image = new Image();
			image.onload = function(imageEvent) {
					// Resize the image
					var canvas = document.createElement('canvas'),
						max_size = 320,
						width = image.width,
						height = image.height;
					if (width > height) {
						if (width > max_size) {
							height *= max_size / width;
							width = max_size;
						}
					} else {
						if (height > max_size) {
							width *= max_size / height;
							height = max_size;
						}
					}
					canvas.width = width;
					canvas.height = height;
					canvas.getContext('2d').drawImage(image, 0, 0, width, height);
					dish.picture = canvas.toDataURL('image/jpeg');
			}
			image.src = reader.result;
		}, false);
		reader.readAsDataURL(content);
	}
}
</script>