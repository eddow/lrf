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
		<s-form class="twelve wide column screen" :model="selected">
			<template scope="scope">
				
				<layout-golden style="height: 100%;" :showPopoutIcon="false">
					<gl-row>
						<gl-col>
							<gl-component title="doT" :closable="false">
								<ace lang="html" v-model="scope.model.dot" />
							</gl-component>
							<gl-component title="CSS" :closable="false">
								<ace lang="css" v-model="scope.model.css" />
							</gl-component>
						</gl-col>
						<gl-col>
							<gl-component title="Preview" :closable="false">
								<iframe class="fill" :srcdoc="compiled">
								</iframe>
							</gl-component>
							<gl-component title="JSON" :closable="false">
								<ace lang="json" v-model="json" />
							</gl-component>
						</gl-col>
					</gl-row>
				</layout-golden>
			</template>
		</s-form>
	</div>
</template>
<style>
.accordion .title {
	border-top: 1px solid black;
}
.fill {
	width: 100%;
	height: 100%;
}
form.screen {
	height: 100vh;
	margin-top: -100px;
	padding-top: calc( 100px + 1rem ) !important;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import Template from 'models/template'
import * as alertify from 'alertify'
import {dav} from 'common/libs/dot-gen'
import * as jsonStringify from 'json-pretty'
var generator = new dav();

@Component
export default class Templates extends Vue {
	Template = Template
	selected: Template = null
	json = ''
	emptyTemplate(cb) {
		alertify.prompt('Template name', name=> {
			if(name) cb({name, dot: '', css: ''});
		});
	}
	created() {
		Vue.axios('/customer/week').then(response=> {
			this.json = jsonStringify(response.data);
		});
	}
	get compiled() {
		var vals;
		try { vals = JSON.parse(this.json); }
		catch(x) { return 'JSON error: '+x; }
		return generator.sandbox(this.selected, vals).toString();
	}
}
</script>