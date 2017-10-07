
import * as S from 'string'
S.extendPrototype();
import 'semantic-ui/dist/semantic.min.css'
//import 'jquery'	//for `v-semantic` source import
import 'vue-property-decorator'	//for `v-semantic` source import

import * as Vue from 'vue'
import semanticVue from 'v-semantic'
Vue.use(semanticVue);
import 'alertify'
import 'alertify.js/dist/css/alertify.css'

import * as draggable from 'vuedraggable'
Vue.component('draggable', draggable);

import * as Vuex from 'vuex'
import * as VueAxios from 'vue-axios'
import * as axios from 'axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios);

import vgl from 'vue-golden-layout'
Vue.use(vgl);

// https://github.com/fuse-box/fuse-box/issues/542
//import 'vue-property-decorator' //This is not needed, I don't know why
import './components/route-menu/item.vue'
import 'json-pretty'
import 'vuex-class'
import 'biz/js-data'