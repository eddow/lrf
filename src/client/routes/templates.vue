<template>
	<div class="ui stackable grid">
		<div class="four wide column">
			<mgd-table
				style="width: 100%;"
				v-model="selected"
				:new-empty="emptyTemplate"
				:recordClass="Template"
				collection-name="Template"
			>
				<s-column prop="name" header="Template" edit>
					<template name="input" slot="field">
					</template>
				</s-column>
			</mgd-table>
		</div>
		<s-form class="twelve wide column" :model="selected">
			<template scope="scope">
				<ace lang="css" v-model="scope.model.css" />
				<!--layout-golden>
					<gl-stack :closable="false">
						<gl-component title="CSS">
							<vae v-model="template.css" lang="css" />
						</gl-component>
						<gl-component title="compB">
							<h1>CompB</h1>
							<button @click="bottomSheet = !bottomSheet">Toggle</button>
						</gl-component>
						<gl-component v-if="bottomSheet">
							<h1>Bottom</h1>
						</gl-component>
					</gl-col>
				</layout-golden-->
			</template>
		</s-form>
	</div>
</template>
<style>
.accordion .title {
	border-top: 1px solid black;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import Template from 'models/template'
import * as alertify from 'alertify'

@Component
export default class Templates extends Vue {
	Template = Template
	selected: Template = null
	emptyTemplate(cb) {
		alertify.prompt('Template name', name=> {
			if(name) cb({name, dot: '', css: ''});
		});
	}
}
</script>