Ext.define('NerdyKaraoke.view.WhatsNew', {
	extend: 'Ext.List',
	xtype: 'WhatsNew',

	config: {
		sorted: true,
        grouped: true,
        infinite: true,
        disableSelection: true,
        variableHeights: true,
        cls: 'lizt',
        itemTpl: '{Artist} - {Title}',
        store: 'NewKaraoke',
        listeners: {
            painted: function() {
                    ga('send', 'event', 'view', 'tap', 'What\'s New');
            }
        }
	}
});
