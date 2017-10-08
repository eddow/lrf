<template>
	<s-input class="right action" :class="{fluid}">
		<s-button slot="prepend" icon="minus" @click="if(1<value) input(value-1)" />
		<s-button slot="append" icon="add" @click="input(value+1)" />
		<input slot="input"
			:value="value"
			min="1"
			type="tel"
			pattern="[1-9][0-9]*"
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