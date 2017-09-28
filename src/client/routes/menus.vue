<template>

	<div>
		<!--div v-for="(cdenom, ccode) in categories" :key="ccode">
			<div class="ui message">{{cdenom}}</div>
			<menu-edit :menu-id="ccode" />
		</div-->
		<menu-edit menu-id="entrance" />
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Menu, {Categories} from 'models/menu'
import {observeDeeply, bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'

const menus = bindCollection('Menu');
@Component
export default class Menus extends Vue {
	categories = Categories
}
</script>