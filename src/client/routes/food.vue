<template>
	<div class="ui two column stackable grid">
		<div v-for="n in 10" class="column">
			{{lorem}}
		</div>
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Dish, {Languages} from 'models/dish'

global

@Component
export default class Food extends Vue {
	lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia tellus elit, condimentum pharetra nisi blandit nec. Integer tempus augue quis purus faucibus tristique. Ut velit ante, laoreet ut urna sed, blandit fringilla ex. Pellentesque nec massa id augue maximus interdum. Vestibulum congue nisl ac lorem scelerisque fermentum id tincidunt nibh. Phasellus non ante libero. Nullam leo lacus, auctor ut nisi id, feugiat maximus nulla. Sed dapibus pretium urna vel interdum. Sed hendrerit, elit sed cursus rutrum, tortor nibh luctus urna, vel molestie neque nunc in diam. Suspendisse eget odio nec leo malesuada tempus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla finibus hendrerit bibendum.
Maecenas et augue viverra, vulputate neque nec, tincidunt orci. Integer consectetur tortor turpis, sit amet convallis leo ullamcorper lacinia. Maecenas justo est, porta sit amet porttitor et, ornare et sem. Mauris ut faucibus justo, ac sodales sem. Etiam dapibus erat vitae mi posuere sollicitudin. Quisque mollis ex elementum, sodales nibh sed, varius est. In urna eros, pretium ac ipsum ut, eleifend lacinia justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin aliquet nunc et est tincidunt porttitor. Donec pharetra ligula diam, tempor pretium turpis vulputate et. Mauris non erat blandit, laoreet arcu ac, eleifend sapien. Maecenas sed metus sit amet dolor varius dignissim non sit amet diam.
Donec tincidunt imperdiet mauris ut eleifend. Morbi congue ultrices commodo. Pellentesque id vehicula quam. Mauris lacinia eget arcu quis mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum semper turpis a aliquam. Proin rutrum rhoncus nisi quis cursus. Quisque semper lacus vel risus sodales varius. Donec euismod quam non aliquam sodales.
Etiam tempus nibh massa, nec sagittis urna interdum facilisis. Proin a pellentesque urna, et aliquet dolor. Duis a cursus nisl, ut blandit neque. Aliquam fringilla tempus congue. Suspendisse blandit risus a elit consequat, quis molestie purus pharetra. Cras tristique ullamcorper turpis, eget porttitor odio maximus a. Maecenas nec arcu gravida dolor pretium semper sed gravida elit. Cras sollicitudin interdum accumsan. Cras convallis leo nec diam lacinia vestibulum.
Aliquam vestibulum vulputate sollicitudin. Nam quam augue, congue posuere porta non, molestie tristique tortor. Sed rutrum augue augue, quis lobortis ante scelerisque at. Sed tincidunt eleifend luctus. Sed diam lacus, suscipit sed enim ut, aliquam pharetra ante. Mauris semper felis sit amet velit tincidunt, sed fringilla tortor tincidunt. Donec egestas auctor magna, eget efficitur lacus varius id. Etiam sed fermentum arcu. Mauris at arcu vel massa rutrum scelerisque. In ante turpis, accumsan sed leo a, pellentesque volutpat justo. Nullam varius est a magna viverra, a fringilla ex molestie. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed varius bibendum quam nec tempor. Cras pharetra erat id orci rhoncus consequat. Ut ullamcorper sed eros at maximus.`
}
</script>