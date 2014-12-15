Ext.define('NerdyKaraoke.model.Songs', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			{name: 'Artist', type: 'string'},
			{name: 'Title', type: 'string'}
		]
	}
});