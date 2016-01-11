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
        itemTpl: [
            '<div style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;">{Title}</div>',
            '<div class="secondaryText" style="font-size:14px">{Artist}</div>'
        ],
        store: 'NewKaraoke'
	}
});
