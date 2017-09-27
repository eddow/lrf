import * as S from 'string'
S.extendPrototype();
import 'semantic-ui/dist/semantic.min.css'

import * as Vue from 'vue'
import semanticVue from 'v-semantic'
Vue.use(semanticVue);
import 'alertify'
import 'alertify.js/dist/css/alertify.css'

import * as Vuex from 'vuex'
import * as VueAxios from 'vue-axios'
import * as axios from 'axios'
 
Vue.use(Vuex);
Vue.use(VueAxios, axios); 

import vueClip from 'vue-clip'
Vue.use(vueClip);

// https://github.com/fuse-box/fuse-box/issues/542
//import 'vue-property-decorator' //This is not needed, I don't know why
import './components/route-menu/item.vue'
