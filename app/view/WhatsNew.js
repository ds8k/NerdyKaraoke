Ext.define('NerdyKaraoke.view.WhatsNew', {
	extend: 'Ext.List',
	xtype: 'WhatsNew',

	config: {
		sorted: true,
        infinite: true,
        disableSelection: true,
        itemHeight: 48,
        cls: 'lizt',
        itemTpl: '{Artist} - {Title}',

        store: {

            autoLoad: true,
            fields: ['Artist', 'Title'],

            proxy: {
                type: 'ajax',
                url: 'resources/new.json',

                reader: {
                    type: 'json',
                    rootProperty: 'karaoke'
                }
            },
            listeners: {
                load: {
                    fn: function(){
                        Ext.Viewport.unmask()
                    }
                }
            }
        }
	}
});
