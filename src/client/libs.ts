
import * as S from 'string'
S.extendPrototype();
//import 'semantic-ui/dist/semantic.min.css'
//import 'jquery'	//for `v-semantic` source import
import 'vue-property-decorator'	//for `v-semantic` source import

import * as Vue from 'vue'
import semanticVue from 'v-semantic'
Vue.use(semanticVue);
//import 'alertify'
//import 'alertify.js/dist/css/alertify.css'

import * as draggable from 'vuedraggable'
Vue.component('draggable', draggable);

import * as VueAxios from 'vue-axios'
import * as axios from 'axios'

Vue.use(VueAxios, axios);
