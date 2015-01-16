Ext.define('NerdyKaraoke.model.NewSongs', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			'Artist',
			'Title',
			'addNew',
			'index'
		]
	}
});
