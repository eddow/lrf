<template>
	<div>
		<nav role="navigation" id="nav_menu" class="ui top attached fixed small menu page">
			<router-link :to="{name: 'food'}"><img src="/logo100.png" /></router-link>
			<span class="ui item">
				<s-button :positive="0<cartQuantity" icon="cart" @click="$router.push({name: 'cart'})">{{cartQuantity}}</s-button>
				<div v-if="isAuthenticated">
					<s-select :text="false" action="hide">
						<s-button slot="bar" icon="wrench" />
						<s-option><router-link :to="{name: 'dishes'}">Plats</router-link></s-option>
						<s-option><router-link :to="{name: 'menus'}">Menus</router-link></s-option>
						<s-option><router-link :to="{name: 'templates'}">Templates</router-link></s-option>
					</s-select>
					<s-button @click="logout">Log out</s-button>
				</div>
				<div v-else>
					<!--s-button @click="login">Log in</s-button-->
					<!--s-button @click="register">Register</s-button-->
				</div>
			</span>
			<div class="right menu">
				<span>
					<s-select v-model="$lang">
						<s-button slot="bar" class="icon"><s-flag :country="languages[$lang].flag" /></s-button>
						<s-option
							v-for="(desc, val) in languages" :key="val"
							:value="val"
						>
							<s-flag :country="desc.flag" /> {{desc.self}}
						</s-option>
					</select>
				</span>
			</div>
		</nav>
		<section id="content_section">
			<router-view></router-view>
		</section>
	</div>
</template>
<style>
#nav_menu {
	height: 102px;
}
#content_section {
	padding-top: 102px;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import * as $ from 'jquery'
import {Languages} from '../common/auxs'

var vuexi18n = '';
function i18n(lng) {
	if(vuexi18n !== lng) {
		Vue.i18n.set(lng);
		vuexi18n = lng;
	}
}
Object.defineProperty(Vue.prototype, '$lang', {
	get() {
		if(!this.$route.params.lang)
			return this.$lang = 'ro';
		var rv = this.$route.params.lang;
		i18n(rv);
		return rv;
	},
	set(value) {
		i18n(value);
		this.$router.push('/'+value+this.$route.path.substr(3));
	}
})

@Component
export default class App extends Vue {
	languages = Languages
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