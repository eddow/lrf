<template>
	<div>
		<s-modal v-model="chooseLogin" :header="$t('Connexion')">
			<form onsubmit="return false">
				<!--s-button icon="github" @click="authenticate('github')" /-->
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
				<div style="width: 0;">Cluj&#8209;Napoca</div>
				<span class="ui item">
					<div>
						<s-button fluid :positive="0<cartQuantity" icon="cart" @click="$router.push({name: 'cart'})">{{cartQuantity}}</s-button>
						<s-button v-if="isClosed" class="closedSign" @click="timeTable">Closed</s-button>
					</div>
					<div v-if="isAuthenticated">
						<s-select :text="false" action="hide" @change="name=> $router.push({name})">
							<s-button v-if="$desktop" slot="bar" icon="wrench" />
							<s-option value="dishes">Plats</s-option>
							<s-option value="menus">Menus</s-option>
							<s-option value="templates">Templates</s-option>
						</s-select>
						<s-button v-if="isClosed" @click="setClosed(false)">Ouvrir</s-button>
						<s-button v-else @click="setClosed(true)">Fermer</s-button>
					</div>
				</span>
				<div class="right menu">
					<s-button icon="big newspaper" @click="$router.push({name: 'week'})" />
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
	/*Magic for mobiles: usually, the header is potiionned at the end of the scroll - with this, the GPU kicks in */
	transform: translateZ(0);
	-webkit-transform: translateZ(0);
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
.closedSign {
	padding: 2px;
	border: 3px double red;
	border-radius: 5px;
}
</style>
<script lang="js">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
import * as $ from 'jquery'
import {Languages} from '../common/auxs'
import * as alertify from 'alertify'
import open from 'biz/opening'
import {hours} from 'config'

//TODO: lang set/get goes through user if connected (but first, have users and user object)
var language = /*Vue.$store.state.auth.profile?*/Vue.prototype.cookies.getItem('lang') || 'ro';
Vue.i18n.set(language);
Object.defineProperty(Vue.prototype, '$lang', {
	get() {
		return language;
	},
	set(lng) {
		if(language !== lng) {
			Vue.i18n.set(lng);
			Vue.prototype.cookies.setItem('lang', lng)
			language = lng;
		}
	},
	configurable: true
})
Vue.util.defineReactive(Vue.prototype, '$lang', language);

@Component
export default class App extends Vue {
	languages = Languages
	@Getter cartQuantity
	get isClosed() {
		return !open.opened;
	}
	set isClosed(value) {
		open.set(!value);
	}
	setClosed(closed) {
		alertify.confirm(closed?"Fermer ?":"Ouvrir ?", ()=> this.isClosed = closed);
	}
	timeTable() {
		alertify.alert(this.$t('Heures d\'ouverture')+`: ${hours.open}-${hours.close}`);
	}
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
	authenticate(provider) {
		this.$auth.authenticate(provider).then(function () {
			this.chooseLogin('cancel');
			// Execute application logic after successful social authentication
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
	get isAuthenticated() {
		return !!this.$store.state.auth.profile;
	}
}
</script>