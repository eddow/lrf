<template>
	<s-input :class="{fluid, 'right action': $mobile}">
		<s-button v-if="$mobile" slot="prepend" icon="minus" @click="if(1<value) input(value-1)" />
		<s-button v-if="$mobile" slot="append" icon="add" @click="input(value+1)" />
		<input slot="input"
			:value="value"
			min="1"
			type="number"
			@input="evt=> input(Number(evt.target.value))"
		/>
	</s-input>
</template>
<style scoped>
:not(.fluid) input {
	width: 80px;
}
</style>
<script>
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
@Component
export default class Cart extends Vue {
	@Model('input') value: number
	@Prop() fluid: boolean

	@Emit() input(number) {
		return !isNaN(number);
	}
}
</script>