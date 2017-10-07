<template>
	<div>
		<nav role="navigation" id="nav_menu" class="ui top fixed small menu page grid">
			<router-link to="/"><img src="/logo100.png" /></router-link>
			<span>
				<s-button positive icon="cart" @click="$router.push('cart')">{{cartQuantity}}</s-button>
			</span>
			<span class="user">
				<span v-if="isAuthenticated">
					<router-link to="/dishes">Plats</router-link>
					<router-link to="/menus">Menus</router-link>
					<router-link to="/templates">Templates</router-link>
					<s-button @click="logout">Log out</s-button>
				</span>
				<span v-else>
					<s-button @click="login">Log in</s-button>
					<!--s-button @click="register">Register</s-button-->
				</span>
			</span>
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
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import * as $ from 'jquery'

@Component
export default class App extends Vue {
	@Getter cartQuantity
	shoot = 1
	signalShoot() { this.shoot = 3-this.shoot; }
	login() {
		this.$store.dispatch('login', {
			user: {
				email: 'this.email',
				password: 'this.password'
			}
		}).then(() => {
			//this.$router.push('profile')
		}).catch(reason=> {
			this.signalShoot();
		});
	}
	register() {
		this.$store.dispatch('register', {
			user: {
				name:'name', email:'email@googl.com', password:'pwd'
			}
		}).then(() => {
			this.$router.push('profile')
		}).catch(reason=> {
			this.signalShoot();
		});
	}
	logout() {
		this.$store.dispatch('logout').then(() => {
			this.$router.push('/')
		}).catch(reason=> {
			this.signalShoot();
		});
	}
	mounted() {
		window.addEventListener('keyup', function(event) {
				// If down arrow was pressed...
				if('s'=== event.key && event.ctrlKey) {
					event.preventDefault();
				}
        var donothing=true;
      });

	}
	/*authenticate (provider) {
		this.$store.dispatch('authenticate', { provider }).then(() => {
			this.$router.push('profile')
		})
	}*/
	get isAuthenticated() {
		return !!this.$store.state.auth.profile;
	}
}
</script>