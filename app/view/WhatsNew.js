Ext.define('NerdyKaraoke.view.WhatsNew', {
	extend: 'Ext.List',
	xtype: 'WhatsNew',

	config: {
		sorted: true,
        grouped: true,
        infinite: true,
        disableSelection: true,
        itemHeight: 48,
        cls: 'lizt',
        itemTpl: '{Artist} - {Title}',
        store: 'NewKaraoke'
	}
});
