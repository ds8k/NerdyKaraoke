Ext.define('NerdyKaraoke.model.RequestForm', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{
				name: 'name'
			},
			{
				name: 'email'
			},
			{
				name: 'artist'
			},
			{
				name: 'title'
			}
		],
		validations: [
			{
				field: 'name',
				type: 'presence',
				message: 'Your name, do you know it?'
			},
			{
				field: 'email',
				type: 'format',
				matcher: /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/,
				message: 'I can\'t respond without a proper email!'
			},
			{
				field: 'artist',
				type: 'presence',
				message: 'I need to know the artist.'
			},
			{
				field: 'title',
				type: 'presence',
				message: 'You know the song title, right?'
			}
		]
	}
});