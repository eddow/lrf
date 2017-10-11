
import * as S from 'string'
S.extendPrototype();

import * as Vue from 'vue'
import semanticVue from 'v-semantic'
Vue.use(semanticVue);

import * as VueAxios from 'vue-axios'
import * as axios from 'axios'
Vue.use(VueAxios, axios);

import * as io from 'socket.io-client'
io.connect(location.origin);