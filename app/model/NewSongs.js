Ext.define('NerdyKaraoke.model.NewSongs', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			{name: 'Artist', type: 'string'},
			{name: 'Title', type: 'string'},
			{name: 'addNew', type: 'string'},
			{name: 'index', type: 'string'}
		]
	}
});
