<template>
	<div>
		<s-modal v-model="chooseLogin" :header="$t('Connexion')">
			<form onsubmit="return false">
				<s-input fluid class="large" v-model="loginDetail.email" placeholder="E-mail" type="email">
					<s-icon slot="prepend" icon="mail" />
				</s-input>
				<s-input fluid class="large" v-model="loginDetail.password" :placeholder="$t('Mot de passe')" type="password">
					<s-icon slot="prepend" icon="privacy" />
				</s-input>

				<s-button class="fluid" positive v-command:ok native-type="submit">{{'Connecter'|translate}} !</s-button>
				<s-button class="fluid" v-command:cancel>{{'Annuler'|translate}}</s-button>
			</form>
		</s-modal>
		<nav role="navigation" id="nav_menu"class="ui top attached menu fixed">
			<div class="ui top attached menu">
				<router-link :to="{name: 'food'}"><img src="/logo100.png" /></router-link>
				<span class="ui item">
					<s-button :positive="0<cartQuantity" icon="cart" @click="$router.push({name: 'cart'})">{{cartQuantity}}</s-button>
					<div v-if="isAuthenticated">
						<s-select :text="false" action="hide" @change="name=> $router.push({name})">
							<s-button slot="bar" icon="wrench" />
							<s-option value="dishes">Plats</s-option>
							<s-option value="menus">Menus</s-option>
							<s-option value="templates">Templates</s-option>
						</s-select>
					</div>
				</span>
				<div class="right menu">
					<div>
						<div v-if="isAuthenticated">
							<!--s-button @click="logout">Log out</s-button-->
							<s-button icon="+large user+big green sun" @click="logout" />
						</div>
						<div v-else>
							<s-button icon="+large user+big circle thin" @click="login" />
							<!--s-button @click="register">Register</s-button-->
						</div>
						<div>
							<s-select v-model="$lang">
								<s-button slot="bar" class="icon"><s-flag :country="languages[$lang].flag" /></s-button>
								<s-option
									v-for="(desc, val) in languages" :key="val"
									:value="val"
								>
									<s-flag :country="desc.flag" /> {{desc.self}}
								</s-option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</nav>
		<section id="content_section">
			<router-view></router-view>
		</section>
	</div>
</template>
<style scoped>
#nav_menu {
	height: 102px;
}
div.ui.menu {
	max-width: 400px;
	margin-left: auto;
	margin-right: auto;
	border: 0 !important;
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
import * as alertify from 'alertify'

var vuexi18n = '';
Vue.i18n.set('ro');
function i18n(lng) {
	if(vuexi18n !== lng) {
		Vue.i18n.set(lng);
		vuexi18n = lng;
	}
}
Object.defineProperty(Vue.prototype, '$lang', {
	get() {
		if(this.$router.history.pending) return 'ro';	//the language is going to be specified soon
		if(!this.$route.params.lang)	//the language has not be specified : let's specify 'ro'
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
	loginDetail = {
		email: '',
		password: ''
	}
	chooseLogin
	login() {
		this.chooseLogin(()=> {
			this.$store.dispatch('login', {
				user: this.loginDetail
			}).then(() => {
				alertify.success(this.$t('Bienvenue !'));
			}).catch(reason=> {
				alertify.error(this.$t('Données de connexion invalides'));
			});
			this.loginDetail = {
				email: '',
				password: ''
			};
		})
	}
	register() {
		this.$store.dispatch('register', {
			user: {
				name:'name', email:'email@googl.com', password:'pwd'
			}
		}).then(() => {
			//this.$router.push({name: 'profile'})
		}).catch(reason=> {
		});
	}
	logout() {
		this.$store.dispatch('logout').then(() => {
			this.$router.push({name: 'food'});
		}).catch(reason=> {
		});
	}
	mounted() {
		window.addEventListener('keyup', function(event) {
				if('s'=== event.key && event.ctrlKey) {
					event.preventDefault();
					//debugger;
					//TODO: save
				}
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