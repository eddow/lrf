<template>
	<div class="screen">
		<section class="navigation-section">
			<nav role="navigation">
			</nav>
		</section>
		<section class="menu">
			<router-view></router-view>
		</section>
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import * as $ from 'jquery'

debugger;

@Component
export default class App extends Vue {
	
}
</script>