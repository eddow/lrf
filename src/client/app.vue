<template>
	<div class="screen">
		<nav role="navigation" id="nav_menu" class="ui top fixed small menu page grid">
			<img src="/logo100.png" />
			<div>Cart</div>
			<div class="user">
				<div v-if="!$auth.isAuthenticated()">
					<s-button @click="login">Log in</s-button>
					<s-button @click="register">Register</s-button>
				</div>
				<s-button v-if="$auth.isAuthenticated()" @click="logout">Log out</s-button>
			</div>
		</nav>
		<section id="content_section">
			<router-view></router-view>
		</section>
	</div>
</template>
<style>
#nav_menu {
	height: 100px;
}
#content_section {
	padding-top: 100px;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import * as $ from 'jquery'

@Component
export default class App extends Vue {
	login() {
		this.$auth.login({email:'test', password:'test'});
	}
	register() {
		this.$auth.register({name:'name', email:'email@googl.com', password:'pwd'});
	}
	logout() {
		this.$auth.logout();
	}
}
</script>