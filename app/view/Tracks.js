Ext.define('NerdyKaraoke.view.Tracks', {
	extend: 'Ext.List',
	xtype: 'Tracks',

	config: {
		grouped: true,
        indexBar: true,
        sorted: true,
        infinite: true,
        itemHeight: 48,
        disableSelection: true,
        pinHeaders: true,
        cls: 'lizt',
        itemTpl: '{Title}',
        emptyText: 'Send requests to requests@nerdykaraoke.com',
        store: 'Karaoke',
        maskOnOpen: true
	}
});
