<template>
	<div ref="editor" style="width: 100%; height: 100%;"></div>
</template>
<script lang="ts">

import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
import * as ace from 'ace'

@Component
export default class Ace extends Vue {
	@Model('change') value: string
	@Prop() lang: string
	@Prop() theme: string
	editor
	beforeContent: string
	@Watch('value') setValue(value) {
		if (this.beforeContent !== value) {
			this.editor.setValue(value, 1)
		}
	}
	mounted () {
		const lang = this.lang || 'text'
		const theme = this.theme || 'eclipse'

		this.editor = ace.edit(this.$refs.editor)
		this.editor.setValue(this.value, 1)
		
		this.editor.getSession().setMode(`ace/mode/${lang}`)
		this.editor.setTheme(`ace/theme/${theme}`)

		this.editor.on('change', () => {
			this.beforeContent = this.editor.getValue()
			this.$emit('change', this.editor.getValue())
		})
	}
}
</script>