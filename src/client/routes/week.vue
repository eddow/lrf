<template>
	<div class="container">
		<s-button icon="+file+green angle down" fluid @click="download" />
		<iframe ref="filler" src="/customer/week.html/Semaine">
		</iframe>
	</div>
</template>
<style scoped>
iframe {
	width: 100%;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import * as $ from 'jquery'

@Component()
export default class Week extends Vue {
	mounted() {
		$(window).on('resize', this.resize);
		this.resize();
	}
	destroyed() {
		$(window).off('resize', this.resize);
	}
	resize() {
		var filler = $(this.$refs.filler);
		filler.height($(window).height() - filler.position().top-12);
	}
	download() {
		window.open('/customer/week.pdf/Semaine', '_blank');
	}
}
</script>
