<template>
	<div class="ui stackable grid">
		<div class="six wide column">
			<mgd-table
				style="width: 100%;"
				v-model="selected"
				:new-empty="emptyDish"
				:recordClass="Dish"
				collection-name="Dish"
				:filter="filter"
			>
				<s-column header="Service">
					<template scope="row">
						{{parts[row.model.part]}}
					</template>
				</s-column>
				<s-column prop="title.fr">
					<search-header slot="header" label="Titre" v-model="filters.title" />
				</s-column>
			</mgd-table>
		</div>
		<s-form class="ten wide column" :model="selected" label-width="120px">
			<template scope="scope">
				<div class="ui stackable grid">
					<div class="six wide column">
						<s-field prop="part" label="Service" inline>
							<template slot="input" scope="field">
								<s-select :name="field.name" selection v-model="field.value">
									<s-option
										v-for="(txt, val) in parts" :key="val"
										:value="val"
										:text="txt"
									/>
								</s-select>
							</template>
						</s-field>
						<s-field prop="grams" label="Grammage" inline 
							:input="number"
							:output="x=> fixed(x)"
						/>
						<s-field prop="price" label="Prix" inline 
							:input="number"
							:output="x=> fixed(x, 2)"
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
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Dish, {Languages, Parts} from 'models/dish'
import * as alertify from 'alertify'

import MgdTable from 'components/mgd-table.vue'
import SearchHeader from 'components/search-header.vue'

@Component({components: {MgdTable, SearchHeader}})
export default class Dishes extends Vue {
	dbg(x) {
		debugger;
		return x;
	}
	Dish = Dish

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
		return rv||0;
	}
	fixed(number, decs) {
		number = number || 0;
		return number.toFixed(decs||0)
	}
	get filter() {
		return this.filters.title ? x=> !!~x.title.fr.indexOf(this.filters.title) : ()=>true;
	}
	select(dish) {
		this.selected = dish;
	}
	emptyDish() {
		return {
			title: {fr: '', en: '', ro: ''},
			description: {fr: '', en: '', ro: ''},
			picture: '',
			price: 0,
			part: ''
		};
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